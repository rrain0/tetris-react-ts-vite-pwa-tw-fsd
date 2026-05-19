import type { ManifestPart } from './manifest.model'




export function addAppDataToAppManifest({
  manifest,
  deployMode, deployLocale, deployTheme,
  appName, appDescription,
  themeColor, bgColor,
}: {
  manifest: ManifestPart
  // Types are not precise because treated simply as values here
  deployMode: string
  deployLocale: string
  deployTheme: string
  appName: string
  appDescription: string
  themeColor: string
  bgColor: string
}): ManifestPart {
  manifest = applyPwaId(manifest, { deployMode, deployLocale, deployTheme })
  manifest = applyLocale(manifest, { deployLocale, appName, appDescription })
  manifest = applyColors(manifest, { themeColor, bgColor })
  return manifest
}



function getPwaId(deployMode: string, deployLocale: string, deployTheme: string) {
  return `tetris-${deployMode}-react-${deployLocale}-${deployTheme}`
}

function applyPwaId(
  manifest: ManifestPart,
  { deployMode, deployLocale, deployTheme }: {
    deployMode: string
    deployLocale: string
    deployTheme: string
  }
): ManifestPart {
  return { ...manifest, id: getPwaId(deployMode, deployLocale, deployTheme) }
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
