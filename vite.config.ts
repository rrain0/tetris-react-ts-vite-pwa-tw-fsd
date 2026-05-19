import { fileURLToPath, URL } from 'node:url'
import { getAppDeployData } from './src/app-deploy/getAppDeployData.ts'
import { type DeployMode, supportedDeployModes } from './src/app-deploy/deployMode.ts'
import { addDeployDataToAppManifest } from './src/app-deploy/manifest/addDeployDataToAppManifest.ts'
import {
  type DeployTheme,
  supportedDeployThemes,
} from './src/app-deploy/theme/getAppDeployThemeData.ts'
import {
  supportedDeployLocales,
  type DeployLocale,
} from './src/app-deploy/locale/getAppDeployLocaleData.ts'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import babelPluginJsxCnStProps from './plugins/babelPluginJsxCnStProps.ts'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import legacy from '@vitejs/plugin-legacy'
import fs from 'node:fs'
import mime from 'mime/lite'



// TODO process test environment (process.env.VITEST === 'true', mode === 'test')



type ProjectRunMode = 'dev' | 'build'



export default defineConfig(({ command, mode }) => {
  const { envReactPort, envLocale, envTheme, envIsVitest } = getDeployEnvVars()
  
  const { projectRunMode, deployMode, deployLocale, deployTheme } = getAppDeployConfig({
    command, mode, envLocale, envTheme, envIsVitest,
  })
  
  const {
    appName, appDescription,
    manifestSearchParams,
    iosSplashscreensPath,
    buildDate, buildVer,
    themeColor, bgColor, iosStatusBarStyle,
    icon48Path, icon64Path, icon167Path, icon180Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
  } = getAppRunAndDeployData({ deployMode, deployLocale, deployTheme })
  
  //const manifestPathSearch = `manifest.json`
  //const manifestPathSearch = `manifest.json${manifestSearchParams}`
  const manifestPath = `manifest.json`
  const manifestPathSearch = `${manifestPath}${manifestSearchParams}`
  
  return {
    // Make url paths absolute (relative to root)
    base: '/',
    
    resolve: {
      //tsconfigPaths: true, // works only for TS (excluding Workers)
      
      // Works for TS (+ Workers), CSS
      alias: {
        '@': fileURLToPath(new URL('src', import.meta.url)),
        '@@': fileURLToPath(new URL('src/shared', import.meta.url)),
      },
    },
    
    // Configure Vite Dev server
    server: {
      host: true, // expose app via IP address from local network
      port: envReactPort, // react dev server port
      allowedHosts: true, // allow any host
    },
    
    // Pass desired env variables to runtime
    define: getEnvVarsRuntime({ projectRunMode, buildVer }),
    
    build: {
      rolldownOptions: {
        output: {
          // Intercept how Rolldown names every single asset
          assetFileNames: (assetInfo) => {
            const filenamePattern = '[name]-[hash].[ext]'
            // Route manifest to root folder
            if (assetInfo.names.includes(manifestPath)) return filenamePattern
            // Else use standard asset route
            return `assets/${filenamePattern}`
          },
        },
      },
    },
    
    plugins: [
      htmlAppDeployDataPlugin({
        deployLocale, appName, appDescription,
        manifestPathSearch,
        themeColor, bgColor, iosStatusBarStyle,
        icon48Path, icon167Path, icon180Path,
        iosSplashscreensPath,
      }),
      
      tailwindcss(),
      
      react(),
      
      babel({ plugins: [babelPluginJsxCnStProps()] }),
      
      babel({ presets: [reactCompilerPreset()] }),
      
      svgrPlugin(),
      
      vitePwaPlugin(),
      
      generatePwaManifestPlugin({
        projectRunMode,
        deployMode, deployLocale, deployTheme,
        manifestPath,
        appName, appDescription,
        themeColor, bgColor,
        icon64Path,
        icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
      }),
      
      viteLegacyPlugin({ buildDate }),
      
      /* {
        name: 'log-bundle',
        generateBundle(options, bundle) {
          const bundleData = { }
          for (const [fileInBundle, fileInfo] of Object.entries(bundle)) {
            // fileName: The final generated hashed name (e.g., 'assets/index-B3x9a1.js')
            // fileInfo.name: The original filename before hashing (e.g., 'index.js')
            if (fileInfo.type === 'asset') {
              const { fileName, originalFileNames, names } = fileInfo
              bundleData[fileInfo.names[0] ?? 'UNDEFINED_NAME'] = {
                fileInBundle, fileName, originalFileNames, names,
              }
            }
          }
          console.log('bundleData:', JSON.stringify(bundleData, null, 2))
        },
      }, */
    ],
    
  }
})



const lastPathSegment = (path: string) => path.match(/[^/]*(?=$|[?#])/)?.[0] ?? ''



function getDeployEnvVars() {
  // Read shell variables.
  // You need to run vite process with already applied env vars from env files.
  const { REACT_PORT, APP_LOCALE, APP_THEME, VITEST } = process.env
  
  return {
    envReactPort: REACT_PORT && /\d+/.test(REACT_PORT) && +REACT_PORT || 40109,
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
  } as const satisfies Record<typeof command, ProjectRunMode>)[command]
  
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
    icon48Path, icon64Path, icon167Path, icon180Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
    manifestSearchParams,
    iosSplashscreensPath,
  } = getAppDeployData({ deployMode, deployLocale, deployTheme })
  
  const buildDate = new Date()
  const buildVer = `${deployMode}-${buildDate.toISOString()}-${deployLocale}-${deployTheme}`
  
  return {
    appName, appDescription,
    iosStatusBarStyle, themeColor, bgColor,
    icon48Path, icon64Path, icon167Path, icon180Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
    manifestSearchParams,
    iosSplashscreensPath,
    buildDate, buildVer,
  }
}



function getEnvVarsRuntime({ projectRunMode, buildVer }: {
  projectRunMode: ProjectRunMode
  buildVer: string
}) {
  const nodeEnv = ({
    'dev': 'development',
    'build': 'production',
  } as const satisfies Record<ProjectRunMode, string>)[projectRunMode]
  
  const envVarsRuntime: Record<string, string> = {
    // Add old-fashioned 'process.env.NODE_ENV' property to support legacy libs and node
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    'import.meta.env.BUILD_VER': JSON.stringify(buildVer),
  }
  
  return envVarsRuntime
}



function htmlAppDeployDataPlugin({
  deployLocale, appName, appDescription,
  manifestPathSearch,
  themeColor, bgColor, iosStatusBarStyle,
  icon48Path, icon167Path, icon180Path,
  iosSplashscreensPath,
}: {
  deployLocale: string
  appName: string
  appDescription: string,
  manifestPathSearch: string
  themeColor: string
  iosStatusBarStyle: string
  bgColor: string
  icon48Path: string
  icon167Path: string
  icon180Path: string
  iosSplashscreensPath: string
}): Plugin {
  return {
    name: 'html-app-headers-plugin',
    transformIndexHtml: {
      order: 'pre', // run this before other plugins and before Vite internal HTML transform
      handler(html) {
        return html
          .replace(/%APP_LOCALE%/g, deployLocale)
          .replace(/%APP_NAME%/g, appName)
          .replace(/%APP_DESCRIPTION%/g, appDescription)
          .replace(/%MANIFEST%/g, manifestPathSearch)
          .replace(/%THEME_COLOR%/g, themeColor)
          .replace(/--BG_COLOR/g, bgColor)
          .replace(/%IOS_STATUS_BAR_STYLE%/g, iosStatusBarStyle)
          .replace(/%FAVICON_48%/g, icon48Path)
          .replace(/%IPAD_ICON_167%/g, icon167Path)
          .replace(/%IPHONE_ICON_180%/g, icon180Path)
          .replace(/%IOS_SPLASHSCREENS_PATH%/g, iosSplashscreensPath)
      },
    },
  }
}



function svgrPlugin() {
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



function generatePwaManifestPlugin({
  projectRunMode,
  deployMode, deployLocale, deployTheme,
  manifestPath,
  appName, appDescription,
  themeColor, bgColor,
  icon64Path,
  icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
}: {
  projectRunMode: ProjectRunMode
  deployMode: string
  deployLocale: string
  deployTheme: string
  manifestPath: string
  appName: string
  appDescription: string
  themeColor: string
  bgColor: string
  icon64Path: string
  icon192Path: string
  icon192MaskablePath: string
  icon512Path: string
  icon512MaskablePath: string
}): Plugin | Plugin[] {
  const plugins: Record<ProjectRunMode, () => Plugin | Plugin[]> = {
    'dev': () => {
      const manifestJson = JSON.stringify(addDeployDataToAppManifest({
        deployMode, deployLocale, deployTheme,
        appName, appDescription,
        themeColor, bgColor,
        icon64Src: icon64Path,
        icon192Src: icon192Path,
        icon192MaskableSrc: icon192MaskablePath,
        icon512Src: icon512Path,
        icon512MaskableSrc: icon512MaskablePath,
      }), null, 2)
      
      const requiredPaths = [
        manifestPath,
        icon64Path,
        icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
      ]
      
      
      //console.log('deploy data', deployMode, deployLocale, deployTheme)
      //console.log('DEV manifestJson', manifestJson)
      
      return {
        name: 'generate-app-manifest-dev',
        // Generate manifest for dev server
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const path = new URL(req.url || '', `http://${req.headers.host}`).pathname
            
            for (const requiredPath of requiredPaths) {
              const basedPath = `${server.config.base}${requiredPath}`
              if (path !== basedPath) continue
              const contentType = mime.getType(basedPath)
              if (!contentType) continue
              const content = (() => {
                if (requiredPath === manifestPath) return manifestJson
                return fs.readFileSync(fileURLToPath(new URL(requiredPath, import.meta.url)))
              })()
              
              res.setHeader('Content-Type', contentType)
              res.end(content)
              return
            }
            
            // const manifestDeployPath = `${server.config.base}${manifestPath}`
            // if (path === manifestDeployPath) {
            //   res.setHeader('Content-Type', 'application/json')
            //   res.end(manifestJson)
            //   return
            // }
            
            next()
          })
        },
      }
    },
    'build': () => {
      return [
        {
          name: 'generate-app-manifest',
          // Tell Rolldown to include the files at the start of the build.
          // Generate manifest file for build with a dynamic content hash.
          buildStart() {
            const iconsPaths = {
              icon64Path,
              icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
            }
            const iconsPathsToBundled = {
              icon64Path: 'icon64Bundled',
              icon192Path: 'icon192Bundled',
              icon192MaskablePath: 'icon192MaskableBundled',
              icon512Path: 'icon512Bundled',
              icon512MaskablePath: 'icon512MaskableBundled',
            } as const
            const iconsBundled = {
              icon64Bundled: '',
              icon192Bundled: '',
              icon192MaskableBundled: '',
              icon512Bundled: '',
              icon512MaskableBundled: '',
            }
            
            Object.entries(iconsPaths).forEach(([name, path]) => {
              const filename = lastPathSegment(path)
              const absPath = fileURLToPath(new URL(path, import.meta.url))
              const filenameBundled = this.getFileName(
                this.emitFile({
                  type: 'asset',
                  name: filename,
                  originalFileName: absPath,
                  source: fs.readFileSync(absPath),
                })
              )
              iconsBundled[iconsPathsToBundled[name]] = filenameBundled
            })
            
            const manifestJson = JSON.stringify(addDeployDataToAppManifest({
              deployMode, deployLocale, deployTheme,
              appName, appDescription,
              themeColor, bgColor,
              icon64Src: iconsBundled.icon64Bundled,
              icon192Src: iconsBundled.icon192Bundled,
              icon192MaskableSrc: iconsBundled.icon192MaskableBundled,
              icon512Src: iconsBundled.icon512Bundled,
              icon512MaskableSrc: iconsBundled.icon512MaskableBundled,
            }), null, 2)
            
            // Physically create manifest file
            // just for Vite to correctly replaces its path in index.html
            fs.writeFileSync(fileURLToPath(new URL(manifestPath, import.meta.url)), manifestJson)
            const manifestBundled = this.getFileName(
              this.emitFile({
                type: 'asset',
                name: lastPathSegment(manifestPath),
                originalFileName: manifestPath,
                source: manifestJson,
              })
            )
            
          },
        },
      ]
    },
  }
  return plugins[projectRunMode]()
}



function vitePwaPlugin() {
  return VitePWA({
    strategies: 'injectManifest', // compile custom SW and inject precache-manifest
    srcDir: './src/service-worker', // SW folder
    filename: 'service-worker.ts', // SW filename
    injectRegister: 'script', // inject SW registration script
    
    // Public assets to be precached in SW.
    // By default, all precached entries are:
    // bundled JS, bundled CSS, public index.html, public registerSW.js, public/**
    // You may add public assets to be precached.
    // These public assets must be in '<project-root>/public/' folder and paths relative to this.
    //includeAssets: ['static/**'],
    
    registerType: 'prompt', // prompt user to reload page when SW was updated
    injectManifest: {
      // Include any project file in the precache-manifest
      globPatterns: ['**/*'],
      rollupOptions: {
        external: ['fsevents'],
      },
    },
    workbox: {
      // Maximum file size to precache (bytes), default is 2 MB
      //maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
    
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
function viteLegacyPlugin({ buildDate }: { buildDate: Date }) {
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
