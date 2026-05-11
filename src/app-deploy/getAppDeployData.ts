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
    icon48, icon64, icon167, icon180,
    icon192, icon192Maskable, icon512, icon512Maskable,
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
    icon48, icon64, icon167, icon180,
    icon192, icon192Maskable, icon512, icon512Maskable,
    manifestSearchParams,
    iosSplashscreensPath,
    buildDate, buildVer,
  }
}