import { type DeployMode, deployModeDefault, supportedDeployModes } from '../deployMode.model.ts'
import { appDeployLocalesData } from './appDeployLocalesData.ts'
import {
  type DeployLocaleData,
  deployLocaleDefault,
  supportedDeployLocales,
} from './deployLocale.model.ts'



export function getAppDeployLocaleData({ deployMode, deployLocale }: {
  // Types are not precise to provide default values
  deployMode: string
  deployLocale: string
}): DeployLocaleData {
  const localeData = { ...(() => {
    if (supportedDeployLocales.includes(deployLocale)) return appDeployLocalesData[deployLocale]
    return appDeployLocalesData[deployLocaleDefault]
  })() }
  
  localeData.appName = (() => {
    const appNameByDeployMode: Record<DeployMode, string> = {
      'development': '[Dev] ' + localeData.appName,
      'staging': '[Stg] ' + localeData.appName,
      'production': localeData.appName,
    }
    
    if (supportedDeployModes.includes(deployMode)) return appNameByDeployMode[deployMode]
    return appNameByDeployMode[deployModeDefault]
  })()
  
  return localeData
}
