import { fileURLToPath, URL } from 'node:url'
import { getAppDeployData } from './src/app-deploy/getAppDeployData.ts'
import { type DeployMode, supportedDeployModes } from './src/app-deploy/deployMode.ts'
import {
  type DeployTheme,
  supportedDeployThemes,
} from './src/app-deploy/theme/getAppDeployThemeData.ts'
import {
  supportedDeployLocales,
  type DeployLocale,
} from './src/app-deploy/locale/getAppDeployLocaleData.ts'
import { getAppManifest } from './src/app-deploy/manifest/getAppManifest.ts'
import { defineConfig, type Plugin, type UserConfigFn } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import babelPluginJsxCnStProps from './plugins/babelPluginJsxCnStProps.js'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import legacy from '@vitejs/plugin-legacy'

// TODO process test environment (process.env.VITEST === 'true', mode === 'test')

type ProjectRunMode = 'dev' | 'build'
type NodeEnv = 'development' | 'production'



export default defineConfig(({ command, mode }) => {
  const { envReactPort, envLocale, envTheme, envIsVitest } = getDeployEnvVars()
  
  const { projectRunMode, deployMode, deployLocale, deployTheme } = getAppDeployConfig({
    command, mode, envLocale, envTheme, envIsVitest,
  })
  
  const {
    appName, appDescription,
    manifestSearchParams,
    buildDate, buildVer,
    themeColor, bgColor, iosStatusBarStyle,
    icon48, icon64, icon167, icon180,
    icon192, icon192Maskable, icon512, icon512Maskable,
  } = getAppRunAndDeployData({ deployMode, deployLocale, deployTheme })
  
  const envVarsRuntime = getEnvVarsRuntime({ projectRunMode, buildVer })
  
  return {
    // Pass desired env variables to runtime
    define: envVarsRuntime,
    
    // Make url paths absolute (relative to root)
    base: '/',
    
    resolve: {
      //tsconfigPaths: true, // works only for TS (excluding Workers)
      
      // Works for TS (+ Workers), CSS
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@@': fileURLToPath(new URL('./src/shared', import.meta.url)),
      },
    },
    
    // Configure Vite Dev server
    server: {
      host: true, // expose app via IP address from local network
      port: envReactPort, // react dev server port
      allowedHosts: true, // allow any host
    },
    
    plugins: [
      // 1. Transform props first
      babel({ plugins: [babelPluginJsxCnStProps()] }),
      
      // 2. Heavy Transformations (Must run before other transforms)
      babel({ presets: [reactCompilerPreset()] }),
      
      // 3. Standard React logic
      react(),
      
      // 4. Styles & Assets
      tailwindcss(),
      getSvgrPlugin(),
      
      // 5. Inject data & paths to html
      getHtmlAppHeadersPlugin({
        deployLocale, appName, appDescription,
        manifestSearchParams,
        themeColor, bgColor, iosStatusBarStyle,
        icon48, icon167, icon180,
      }),
      
      // 6. PWA & Build (Keep these at the bottom)
      getGeneratePwaManifestPlugin({
        deployMode,
        deployLocale, appName, appDescription,
        themeColor, bgColor,
        icon64,
        icon192, icon192Maskable, icon512, icon512Maskable,
      }),
      getVitePwaPlugin(),
      getViteLegacyPlugin({ buildDate }),
    ],
    
  }
})



function getDeployEnvVars() {
  // Read shell variables.
  // You need to run vite process with already applied env vars from env files.
  const { REACT_PORT, APP_LOCALE, APP_THEME, VITEST } = process.env
  
  return {
    envReactPort: !REACT_PORT || !/\d+/.test(REACT_PORT) ? 40109 : +REACT_PORT,
    envLocale: APP_LOCALE || 'en-US',
    envTheme: APP_THEME || 'dark',
    envIsVitest: VITEST === 'true',
  }
}



function getAppDeployConfig({ command, mode, envLocale, envTheme, envIsVitest }: {
  command: 'serve' | 'build'
  mode: string
  envLocale: string
  envTheme: string
  envIsVitest: boolean
}) {
  const projectRunMode: ProjectRunMode = ({
    'serve': 'dev',
    'build': 'build',
  } as const)[command]
  
  // Check if deployMode supported
  if (!supportedDeployModes.includes(mode)) {
    throw new Error(
      `Deploy mode "${mode}" is not supported, ` +
      `supported deploy modes are "${JSON.stringify(supportedDeployModes)}"`
    )
  }
  const deployMode: DeployMode = mode
  
  // Check if locale supported
  if (!supportedDeployLocales.includes(envLocale)) {
    throw new Error(
      `Deploy locale "${envLocale}" is not supported, ` +
      `supported deploy locales are "${JSON.stringify(supportedDeployLocales)}"`
    )
  }
  const deployLocale: DeployLocale = envLocale
  
  // Check if theme supported
  if (!supportedDeployThemes.includes(envTheme)) {
    throw new Error(
      `Deploy theme "${envTheme}" is not supported, ` +
      `supported deploy themes are "${JSON.stringify(supportedDeployThemes)}"`
    )
  }
  const deployTheme: DeployTheme = envTheme

  return { projectRunMode, deployMode, deployLocale, deployTheme }
}



function getAppRunAndDeployData({ deployMode, deployLocale, deployTheme }: {
  deployMode: DeployMode
  deployLocale: DeployLocale
  deployTheme: DeployTheme
}) {
  const {
    appName, appDescription,
    iosStatusBarStyle, themeColor, bgColor,
    icon48, icon64, icon167, icon180,
    icon192, icon192Maskable, icon512, icon512Maskable,
    manifestSearchParams,
  } = getAppDeployData({ deployMode, deployLocale, deployTheme })
  
  const buildDate = new Date()
  const buildVer = `${deployMode}-${buildDate.toISOString()}-${deployLocale}-${deployTheme}`
  
  return {
    appName, appDescription,
    iosStatusBarStyle, themeColor, bgColor,
    icon48, icon64, icon167, icon180,
    icon192, icon192Maskable, icon512, icon512Maskable,
    manifestSearchParams,
    buildDate, buildVer,
  }
}



function getEnvVarsRuntime({ projectRunMode, buildVer }: {
  projectRunMode: ProjectRunMode
  buildVer: string
}) {
  const projectRunModeToNodeEnv: Record<ProjectRunMode, NodeEnv> = {
    'dev': 'development',
    'build': 'production',
  }
  
  const envVarsRuntime: Record<string, string> = {
    // Add old-fashioned 'process.env.NODE_ENV' property to support legacy libs and node
    'process.env.NODE_ENV': JSON.stringify(projectRunModeToNodeEnv[projectRunMode]),
    'import.meta.env.BUILD_VER': JSON.stringify(buildVer),
  }
  
  return envVarsRuntime
}



function getHtmlAppHeadersPlugin({
  deployLocale, appName, appDescription,
  manifestSearchParams,
  themeColor, bgColor, iosStatusBarStyle,
  icon48, icon167, icon180,
}: {
  deployLocale: string
  appName: string
  appDescription: string,
  manifestSearchParams: string
  themeColor: string
  iosStatusBarStyle: string
  bgColor: string
  icon48: string
  icon167: string
  icon180: string
}): Plugin {
  return {
    name: 'html-app-headers-plugin',
    transformIndexHtml(html) {
      return html
        .replace(/%APP_LOCALE%/g, deployLocale)
        .replace(/%APP_NAME%/g, appName)
        .replace(/%APP_DESCRIPTION%/g, appDescription)
        .replace(/%MANIFEST_SEARCH_PARAMS%/g, manifestSearchParams)
        .replace(/%THEME_COLOR%/g, themeColor)
        .replace(/%BG_COLOR%/g, bgColor)
        .replace(/%IOS_STATUS_BAR_STYLE%/g, iosStatusBarStyle)
        .replace(/%FAVICON_48%/g, icon48)
        .replace(/%IPAD_ICON_167%/g, icon167)
        .replace(/%IPHONE_ICON_180%/g, icon180)
    },
  }
}



function getSvgrPlugin() {
  return svgr({
    svgrOptions: {
      // These plugins must be manually installed as dev deps
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      svgo: true,
      ref: true,
      memo: true,
      titleProp: true, // title prop => title tag
      descProp: true, // desc prop => desc tag
      svgoConfig: {
        plugins: [
          //'removeTitle',
          //'removeDesc',
          // SVG elements' id attr auto prefixer to avoid duplicate ids across all document
          {
            name: 'prefixIds',
            params: {
              prefixIds: true,
              prefixClassNames: false,
              delim: '',
              prefix: (() => {
                let id = 0
                return () => `--${(id++).toString(16).padStart(8, '0')}--`
              })(),
            },
          },
        ],
      },
    },
  })
}



function getGeneratePwaManifestPlugin({
  deployMode,
  deployLocale, appName, appDescription,
  themeColor, bgColor,
  icon64,
  icon192, icon192Maskable, icon512, icon512Maskable,
}: {
  deployMode: string
  deployLocale: string
  appName: string
  appDescription: string
  themeColor: string
  bgColor: string
  icon64: string
  icon192: string
  icon192Maskable: string
  icon512: string
  icon512Maskable: string
}): Plugin[] {
  const manifestJson = JSON.stringify(getAppManifest({
    deployMode,
    deployLocale, appName, appDescription,
    themeColor, bgColor,
    icon64,
    icon192, icon192Maskable, icon512, icon512Maskable,
  }))
  return [
    {
      name: 'generate-and-inject-manifest',
      // Generate manifest for dev server
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const { pathname } = new URL(req.url || '', `http://${req.headers.host}`)
          const manifestPath = `${server.config.base}manifest.json`
          if (pathname === manifestPath) {
            res.setHeader('Content-Type', 'application/json')
            res.end(manifestJson)
            return
          }
          next()
        })
      },
      // Generate manifest file for build
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: manifestJson,
        })
      },
    },
  ]
}



function getVitePwaPlugin() {
  return VitePWA({
    strategies: 'injectManifest', // compile custom SW and inject precache-manifest
    srcDir: './src/service-worker', // SW folder
    filename: 'service-worker.ts', // SW filename
    injectRegister: 'script', // inject SW registration script
    //includeAssets: ['public/static/**'], // public assets to be precached in SW
    includeAssets: [],
    
    registerType: 'prompt', // prompt user to reload page when SW was updated
    
    // Disable manifest generation & html injection by plugin.
    // I generate dynamic manifest & dynamic html link manifest search params by myself.
    manifest: false,
    
    devOptions: {
      enabled: true, // enable PWA in dev mode
      type: 'module', // SW is module
    },
    
    pwaAssets: { disabled: true }, // Auto-generation of pwa assets
  })
}



// Add polyfills to final build (dev mode has no polyfills)
function getViteLegacyPlugin({ buildDate }: { buildDate: Date }) {
  return legacy({
    polyfills: false,
    renderLegacyChunks: false,
    
    modernPolyfills: true,
    renderModernChunks: true,
    modernTargets: [
      `since ${buildDate.getFullYear() - 4}-01-01`,
      // A browser is not dead
      // if it has not been without official support or updates for 24 months.
      'not dead',
    ],
  })
}
