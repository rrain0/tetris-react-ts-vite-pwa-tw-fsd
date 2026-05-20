import { type DeployMode, deployModeDefault, supportedDeployModes } from '../deployMode.model.ts'
import type { DeployIcons } from './deployIcons.model.ts'



export function getAppDeployIcons({ deployMode }: {
  // Types are not precise to provide default values
  deployMode: string,
}): DeployIcons {
  const iconsPathByDeployMode: Record<DeployMode, string> = {
    'development': 'src/static-deploy-dev/assets/app-icon',
    'staging': 'src/static-deploy-stg/assets/app-icon',
    'production': 'src/static/assets/app-icon',
  }
  
  const path = ((): string => {
    if (supportedDeployModes.includes(deployMode)) return iconsPathByDeployMode[deployMode]
    return iconsPathByDeployMode[deployModeDefault]
  })()
  
  return {
    icon48Path: `${path}/icon-48.png`,
    icon64Path: `${path}/icon-64.png`,
    icon167Path: `${path}/icon-167.png`,
    icon180Path: `${path}/icon-180.png`,
    icon192Path: `${path}/icon-192.png`,
    icon192MaskablePath: `${path}/icon-192-maskable.png`,
    icon512Path: `${path}/icon-512.png`,
    icon512MaskablePath: `${path}/icon-512-maskable.png`,
  }
}
