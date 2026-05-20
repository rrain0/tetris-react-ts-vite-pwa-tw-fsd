import manifestBase from './manifest.base.json'
import type { ManifestPart } from './manifest.model.ts'



// It just pastes values to manifest
export function manifestToUpdated({
  manifest,
  pwaMode,
  locale,
  appName, appDescription,
  themeColor, bgColor,
  icons,
}: {
  manifest?: ManifestPart | undefined
  pwaMode?: string | undefined // 'fullscreen', 'standalone', 'minimal-ui', 'browser'
  locale?: string | undefined // 'en-US', ...
  appName?: string | undefined
  appDescription?: string | undefined
  themeColor?: string | undefined // #000000, black, ...
  bgColor?: string | undefined // #000000, black, ...
  icons?: {
    icon64Src: string
    icon192Src: string
    icon192MaskableSrc: string
    icon512Src: string
    icon512MaskableSrc: string
  } | undefined
}) {
  return {
    ...manifest ?? manifestBase as ManifestPart,
    ...manifestDisplayValues.includes(pwaMode) && { display: pwaMode },
    ...locale !== undefined && { lang: locale },
    ...appName !== undefined && { name: appName, short_name: appName },
    ...appDescription !== undefined && { description: appDescription },
    ...themeColor !== undefined && { theme_color: themeColor },
    ...bgColor !== undefined && { background_color: bgColor },
    ...icons && {
      icons: [
        {
          src: icons.icon64Src,
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: icons.icon192Src,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: icons.icon192MaskableSrc,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: icons.icon512Src,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: icons.icon512MaskableSrc,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  }
}

const manifestDisplayValues = ['fullscreen', 'standalone', 'minimal-ui', 'browser'] as const
