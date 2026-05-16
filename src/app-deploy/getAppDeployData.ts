import { getAppDeployIcons } from './icons/getAppDeployIcons.ts'
import {
  getAppDeployIosSplashscreensPath
} from './ios-splashscreen/getAppDeployIosSplashscreensPath.ts'
import {
  getAppDeployLocaleData,
} from './locale/getAppDeployLocaleData.ts'
import { getAppManifestSearchParams } from './manifest/getAppManifestSearchParams.ts'
import { getAppDeployThemeData } from './theme/getAppDeployThemeData.ts'



export function getAppDeployData({ deployMode, deployLocale, deployTheme }: {
  // Types are not precise to provide default values
  deployMode: string
  deployLocale: string
  deployTheme: string
}) {
  const {
    appName, appDescription,
  } = getAppDeployLocaleData({ deployMode, deployLocale })
  const {
    iosStatusBarStyle, themeColor, bgColor,
  } = getAppDeployThemeData({ deployTheme })
  const {
    icon48Path, icon64Path, icon167Path, icon180Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
  } = getAppDeployIcons({ deployMode })
  const manifestSearchParams = getAppManifestSearchParams({
    deployMode, locale: deployLocale, theme: deployTheme,
  })
  const { iosSplashscreensPath } = getAppDeployIosSplashscreensPath({ deployMode })
  
  
  const buildDate = new Date()
  const buildVer = `${deployMode}-${buildDate.toISOString()}-${deployLocale}-${deployTheme}`
  
  
  return {
    deployMode, deployLocale, deployTheme,
    appName, appDescription,
    iosStatusBarStyle, themeColor, bgColor,
    icon48Path, icon64Path, icon167Path, icon180Path,
    icon192Path, icon192MaskablePath, icon512Path, icon512MaskablePath,
    manifestSearchParams,
    iosSplashscreensPath,
    buildDate, buildVer,
  }
}