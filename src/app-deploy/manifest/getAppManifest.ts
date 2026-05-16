import manifestBase from './manifest.base.json'
import { type ManifestOptions } from 'vite-plugin-pwa'



export type ManifestPart = Partial<ManifestOptions>



export function getAppManifest({
  deployMode, deployLocale,
  appName, appDescription,
  themeColor, bgColor,
  icon64Path,
  icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
}: {
  // Types are not precise to provide default values
  deployMode: string
  deployLocale: string
  appName: string
  appDescription: string
  themeColor: string
  bgColor: string
  icon64Path: string
  icon192Path: string
  icon192MaskablePath: string
  icon512Path: string
  icon512MaskablePath: string
}): ManifestPart {
  let manifest = manifestBase as ManifestPart
  manifest = applyPwaId(manifest, { deployMode, deployLocale })
  manifest = applyLocale(manifest, { deployLocale, appName, appDescription })
  manifest = applyColors(manifest, { themeColor, bgColor })
  manifest = applyIcons(manifest, { 
    icon64Path, 
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
  })
  return manifest
}



function getPwaId(deployMode: string, deployLocale: string) {
  return `tetris-${deployMode}-react-${deployLocale}`
}

function applyPwaId(
  manifest: ManifestPart,
  { deployMode, deployLocale }: {
    deployMode: string
    deployLocale: string
  }
): ManifestPart {
  return { ...manifest, id: getPwaId(deployMode, deployLocale) }
}

function applyLocale(
  manifest: ManifestPart,
  { deployLocale, appName, appDescription }: {
    deployLocale: string
    appName: string
    appDescription: string
  }
): ManifestPart {
  return {
    ...manifest,
    lang: deployLocale,
    name: appName,
    short_name: appName,
    description: appDescription,
  }
}

function applyColors(
  manifest: ManifestPart,
  { themeColor, bgColor }: {
    themeColor: string
    bgColor: string
  }
): ManifestPart {
  return {
    ...manifest,
    theme_color: themeColor,
    background_color: bgColor,
  }
}

function applyIcons(
  manifest: ManifestPart,
  {
    icon64Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
  }: {
    icon64Path: string
    icon192Path: string
    icon192MaskablePath: string
    icon512Path: string
    icon512MaskablePath: string
  },
): ManifestPart {
  return {
    ...manifest,
    icons: [
      {
        src: icon64Path,
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: icon192Path,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icon192MaskablePath,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: icon512Path,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icon512MaskablePath,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
