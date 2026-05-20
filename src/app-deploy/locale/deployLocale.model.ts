
export const supportedDeployLocales = ['en-US'] as const
export type DeployLocale = typeof supportedDeployLocales[number]
export const deployLocaleDefault: DeployLocale = 'en-US'
export type DeployLocaleData = {
  appName: string
  appDescription: string
}
