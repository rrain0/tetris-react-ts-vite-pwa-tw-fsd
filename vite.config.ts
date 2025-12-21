import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import legacy from '@vitejs/plugin-legacy'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'



// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  
  const config = {
    reactDevServerPort: 40109,
  }
  
  
  
  const buildDate = new Date()
  const buildDateStr = buildDate.toISOString()
  
  const envVarsRuntime: Record<string, string> = {
    // Add old-fashioned 'process.env.NODE_ENV' property to support legacy libs and node
    'process.env.NODE_ENV': JSON.stringify(mode),
    'import.meta.env.BUILD_DATE': JSON.stringify(buildDateStr),
  }
  /*
  if (mode === 'development') {
    envVarsRuntime = { ...envVarsRuntime,
      'import.meta.env.BACKEND_HOST': JSON.stringify('80.87.194.16'),
      'import.meta.env.BACKEND_PORT': JSON.stringify('8000'),
    }
  }
  if (mode === 'production') {
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
      // Aliases here are necessary to build paths for workers & css.
      // Aliases must be duplicated in tsconfig.app.json for ts compiler.
      alias: {
        'src': fileURLToPath(new URL('./src', import.meta.url)),
        
        '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
        '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
        '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
        
        '@assets': fileURLToPath(new URL('./src/shared/assets', import.meta.url)),
        '@libs': fileURLToPath(new URL('./src/shared/libs', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/shared/utils', import.meta.url)),
      },
    },
    
    // Configure vite DEVELOPMENT server
    server: {
      // Expose app via IP address from local network
      host: true,
      // React dev server port
      port: config.reactDevServerPort,
      // Allow any host
      allowedHosts: true,
    },
    
    esbuild: {
      supported: {
        // Declare that browsers can handle top-level-await features
        'top-level-await': true,
      },
    },
    
    plugins: [
      
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: [
            '@emotion/babel-plugin',
            'babel-plugin-react-compiler',
          ],
        },
      }),
      
      tsconfigPaths(),
      
      // Add polyfills to build (in dev mode there is no polyfills)
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
      
      svgr({
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
      }),
      
      checker({
        // Use TypeScript check on the fly in development
        typescript: true,
      }),
      
    ],
    
  }
})

