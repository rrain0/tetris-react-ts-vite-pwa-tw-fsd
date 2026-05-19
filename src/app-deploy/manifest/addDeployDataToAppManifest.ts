import { addAppDataToAppManifest } from './addAppDataToAppManifest.ts'
import manifestBase from './manifest.base.json'
import type { ManifestPart } from './manifest.model.ts'



export function addDeployDataToAppManifest({
  manifest,
  deployMode, deployLocale, deployTheme,
  appName, appDescription,
  themeColor, bgColor,
  icon64Src,
  icon192Src, icon192MaskableSrc, icon512Src, icon512MaskableSrc,
}: {
  manifest?: ManifestPart | undefined
  // Types are not precise because treated simply as values here
  deployMode: string
  deployLocale: string
  deployTheme: string
  appName: string
  appDescription: string
  themeColor: string
  bgColor: string
  icon64Src: string
  icon192Src: string
  icon192MaskableSrc: string
  icon512Src: string
  icon512MaskableSrc: string
}): ManifestPart {
  manifest ??= manifestBase as ManifestPart
  manifest = addAppDataToAppManifest({
    manifest,
    deployMode, deployLocale, deployTheme,
    appName, appDescription,
    themeColor, bgColor,
  })
  manifest = applyIcons(manifest, { 
    icon64Src, 
    icon192Src, icon192MaskableSrc, icon512Src, icon512MaskableSrc,
  })
  return manifest
}



function applyIcons(
  manifest: ManifestPart,
  {
    icon64Src,
    icon192Src, icon192MaskableSrc, icon512Src, icon512MaskableSrc,
  }: {
    icon64Src: string
    icon192Src: string
    icon192MaskableSrc: string
    icon512Src: string
    icon512MaskableSrc: string
  },
): ManifestPart {
  return {
    ...manifest,
    icons: [
      {
        src: icon64Src,
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: icon192Src,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icon192MaskableSrc,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: icon512Src,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icon512MaskableSrc,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
