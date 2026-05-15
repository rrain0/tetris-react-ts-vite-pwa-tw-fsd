import {
  type DeployMode,
  deployModeDefault,
  supportedDeployModes,
} from '../deployMode.ts'



export type DeployIcons = {
  icon48: string
  icon64: string
  icon167: string
  icon180: string
  icon192: string
  icon192Maskable: string
  icon512: string
  icon512Maskable: string
}



export function getAppDeployIcons({ deployMode }: {
  // Types are not precise to provide default values
  deployMode: string,
}): DeployIcons {
  const iconsByDeployMode: Record<DeployMode, DeployIcons> = {
    'development': (() => {
      const assetsPath = 'src/static-deploy-dev/assets/app-icon'
      return {
        icon48: `${assetsPath}/icon-48.png`,
        icon64: `${assetsPath}/icon-64.png`,
        icon167: `${assetsPath}/icon-167.png`,
        icon180: `${assetsPath}/icon-180.png`,
        icon192: `${assetsPath}/icon-192.png`,
        icon192Maskable: `${assetsPath}/icon-192-maskable.png`,
        icon512: `${assetsPath}/icon-512.png`,
        icon512Maskable: `${assetsPath}/icon-512-maskable.png`,
      }
    })(),
    'staging': (() => {
      const assetsPath = 'src/static-deploy-stg/assets/app-icon'
      return {
        icon48: `${assetsPath}/icon-48.png`,
        icon64: `${assetsPath}/icon-64.png`,
        icon167: `${assetsPath}/icon-167.png`,
        icon180: `${assetsPath}/icon-180.png`,
        icon192: `${assetsPath}/icon-192.png`,
        icon192Maskable: `${assetsPath}/icon-192-maskable.png`,
        icon512: `${assetsPath}/icon-512.png`,
        icon512Maskable: `${assetsPath}/icon-512-maskable.png`,
      }
    })(),
    'production': (() => {
      const assetsPath = 'src/static/assets/app-icon'
      return {
        icon48: `${assetsPath}/icon-48.png`,
        icon64: `${assetsPath}/icon-64.png`,
        icon167: `${assetsPath}/icon-167.png`,
        icon180: `${assetsPath}/icon-180.png`,
        icon192: `${assetsPath}/icon-192.png`,
        icon192Maskable: `${assetsPath}/icon-192-maskable.png`,
        icon512: `${assetsPath}/icon-512.png`,
        icon512Maskable: `${assetsPath}/icon-512-maskable.png`,
      }
    })(),
  }
  
  if (supportedDeployModes.includes(deployMode)) return iconsByDeployMode[deployMode]
  return iconsByDeployMode[deployModeDefault]
}
