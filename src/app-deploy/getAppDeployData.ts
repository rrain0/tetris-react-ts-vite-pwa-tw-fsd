import { getAppData } from './getAppData.ts'
import { getAppDeployIcons } from './icons/getAppDeployIcons.ts'
import { getAppManifestSearchParams } from './manifest/getAppManifestSearchParams.ts'



export function getAppDeployData({ deployMode, deployLocale, deployTheme }: {
  // Types are not precise to provide default values
  deployMode: string
  deployLocale: string
  deployTheme: string
}) {
  const {
    appName, appDescription,
    iosStatusBarStyle, themeColor, bgColor,
  } = getAppData({ deployMode, deployLocale, deployTheme })
  const {
    icon48Path, icon64Path, icon167Path, icon180Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
  } = getAppDeployIcons({ deployMode })
  const manifestSearchParams = getAppManifestSearchParams({
    deployMode, locale: deployLocale, theme: deployTheme,
  })
  
  
  const buildDate = new Date()
  const buildVer = `${deployMode}-${buildDate.toISOString()}-${deployLocale}-${deployTheme}`
  
  
  return {
    deployMode, deployLocale, deployTheme,
    appName, appDescription,
    iosStatusBarStyle, themeColor, bgColor,
    icon48Path, icon64Path, icon167Path, icon180Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
    manifestSearchParams,
    buildDate, buildVer,
  }
}
