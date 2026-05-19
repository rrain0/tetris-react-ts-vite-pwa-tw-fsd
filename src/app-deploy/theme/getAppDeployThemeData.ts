import { appDeployThemesData } from './appDeployThemesData.ts'



export const supportedDeployThemes = ['dark'] as const
export type DeployTheme = typeof supportedDeployThemes[number]
export const deployThemeDefault: DeployTheme = 'dark'
export type DeployThemeData = {
  iosStatusBarStyle: 'default' | 'black' | 'black-translucent'
  themeColor: string
  bgColor: string
}



export function getAppDeployThemeData({ deployTheme }: {
  // Types are not precise to provide default values
  deployTheme: string,
}): DeployThemeData {
  const themeData = { ...(() => {
    if (supportedDeployThemes.includes(deployTheme)) return appDeployThemesData[deployTheme]
    return appDeployThemesData[deployThemeDefault]
  })() }
  return themeData
}
