import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import babelPluginJsxCnStProps from './plugins/babelPluginJsxCnStProps.js'
import svgr from 'vite-plugin-svgr'
import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa'
import legacy from '@vitejs/plugin-legacy'
import manifest from './manifest.base.json'



const appBuildConfig = {
  development: {
    port: 40109,
  },
  appHeadersByLang: {
    // 'en': {
    //   appLang: 'en-US',
    //   appName: 'Tetris',
    //   appDescription: 'Tetris Game',
    // },
    'en': {
      appLang: 'en-US',
      appName: 'HTML Title',
      appDescription: 'HTML Description',
    },
  },
}

function getAppBuildData(
  buildMode: string,
  buildLang: string,
) {
  const supportedModes = ['development', 'production'] as const
  // Check if buildMode supported
  if (!supportedModes.includes(buildMode)) {
    throw new Error(
      `Build buildMode [${buildMode}] is not supported, ` +
      `supported modes are [${JSON.stringify(supportedModes)}]`)
  }
  
  // Check if lang supported
  const headersByLang = appBuildConfig.appHeadersByLang
  const headers = headersByLang[buildLang]
  if (!headers) throw new Error(
    `Build appLang [${buildLang}] is not supported, ` +
    `supported langs are [${JSON.stringify(Object.keys(headersByLang))}]`
  )
  
  
  let { appLang, appName, appDescription } = headers
  
  
  // Modify headers by buildLang
  if (buildMode === 'development') {
    appName = 'Dev ' + headers.appName
  }
  
  
  // Create manifest search params by buildMode
  let manifestSearchParams = new URLSearchParams({ buildMode }).toString()
  if (manifestSearchParams) manifestSearchParams = '?' + manifestSearchParams
  
  
  const buildDate = new Date()
  const buildVer = `${buildMode}-${buildDate.toISOString()}-${buildLang}`
  
  
  return { 
    appLang, appName, appDescription, 
    manifestSearchParams,
    buildDate, buildVer,
  }
}



// https://vite.dev/config/
export default defineConfig(({ command, mode: buildMode }) => {
  const {
    appLang, appName, appDescription,
    manifestSearchParams,
    buildDate, buildVer,
  } = getAppBuildData(buildMode, 'en')
  
  const envVarsRuntime: Record<string, string> = {
    // Add old-fashioned 'process.env.NODE_ENV' property to support legacy libs and node
    'process.env.NODE_ENV': JSON.stringify(buildMode),
    'import.meta.env.BUILD_VER': JSON.stringify(buildVer),
  }
  /*
  if (buildMode === 'development') {
    envVarsRuntime = { ...envVarsRuntime,
      'import.meta.env.BACKEND_HOST': JSON.stringify('80.87.194.16'),
      'import.meta.env.BACKEND_PORT': JSON.stringify('8000'),
    }
  }
  if (buildMode === 'production') {
    envVarsRuntime = { ...envVarsRuntime,
      'import.meta.env.BACKEND_HOST': JSON.stringify('80.87.194.16'),
      'import.meta.env.BACKEND_PORT': JSON.stringify('8000'),
    }
  }
  */
  
  
  return {
    
    // Pass desired env variables to runtime
    define: envVarsRuntime,
    
    // Make url paths absolute (relative to root)
    base: '/',
    
    resolve: {
      tsconfigPaths: true,
      // Aliases here are necessary to build paths for Workers & CSS.
      // Aliases must be duplicated in tsconfig.app.json for ts compiler.
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@@': fileURLToPath(new URL('./src/shared', import.meta.url)),
      },
    },
    
    // Configure vite DEVELOPMENT server
    server: {
      // Expose app via IP address from local network
      host: true,
      // React dev server port
      port: appBuildConfig.development.port,
      // Allow any host
      allowedHosts: true,
    },
    
    plugins: [
      addHtmlAppHeadersPlugin(appLang, appName, appDescription, manifestSearchParams),
      
      tailwindcss(),
      
      react(),
      
      babel({
        presets: [reactCompilerPreset()],
        plugins: [babelPluginJsxCnStProps()],
      }),
      
      addSvgrPlugin(),
      
      addVitePwaPlugin(),
      
      // Add polyfills to final build (dev mode has no polyfills)
      legacy({
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
      }),
    ],
    
  }
})



function addHtmlAppHeadersPlugin(
  appLang: string,
  appName: string,
  appDescription: string,
  manifestSearchParams: string,
): Plugin {
  return {
    name: 'html-app-headers-plugin',
    transformIndexHtml(html) {
      return html
        .replace(/%APP_LANG%/g, appLang)
        .replace(/%APP_NAME%/g, appName)
        .replace(/%APP_DESCRIPTION%/g, appDescription)
        .replace(/%MANIFEST_SEARCH_PARAMS%/g, manifestSearchParams)
    },
  }
}



function addSvgrPlugin() {
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



function addVitePwaPlugin() {
  let m = manifest as Partial<ManifestOptions>
  
  return VitePWA({
    strategies: 'injectManifest', // compile custom SW and inject precache-manifest
    srcDir: 'src/service-worker', // SW folder
    filename: 'service-worker.ts', // SW filename
    injectRegister: 'script', // inject SW registration script
    includeAssets: ['public/static/**'], // static assets to be precached in SW
    
    registerType: 'prompt', // prompt user to reload page when SW was updated
    
    // Disable manifest generation & injection by plugin.
    // I want to generate dynamic manifest & dynamic html link manifest search params.
    manifest: false,
    
    devOptions: {
      enabled: true, // enable PWA in dev mode
      type: 'module', // SW is module
    },
    
    pwaAssets: { disabled: true }, // Auto-generation of pwa assets
  })
}
