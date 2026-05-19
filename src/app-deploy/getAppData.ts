import {
  getAppDeployLocaleData,
} from './locale/getAppDeployLocaleData.ts'
import { getAppDeployThemeData } from './theme/getAppDeployThemeData.ts'



export function getAppData({ deployMode, deployLocale, deployTheme }: {
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
  
  
  return {
    deployMode, deployLocale, deployTheme,
    appName, appDescription,
    iosStatusBarStyle, themeColor, bgColor,
  }
}