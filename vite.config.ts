import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import checker from 'vite-plugin-checker'



// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  
  // Configure vite DEVELOPMENT server (yarn run dev)
  server: {
    // Expose app via IP address from local network
    host: true,
    // React dev server port
    port: 40109,
    // Allow any host
    allowedHosts: true,
  },
  
  // Make paths absolute, relative to root
  base: '/',
  
  esbuild: {
    supported: {
      // Browsers can handle top-level-await features
      'top-level-await': true,
    },
  },
  
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    tsconfigPaths(),
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
}))
