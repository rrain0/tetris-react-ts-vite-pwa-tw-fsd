import {
  type DeployMode,
  deployModeDefault,
  supportedDeployModes,
} from '../deployMode.ts'



export type DeployIosSplashscreens = {
  iosSplashscreensPath: string
}



export function getAppDeployIosSplashscreensPath({ deployMode }: {
  // Types are not precise to provide default values
  deployMode: string,
}): DeployIosSplashscreens {
  const iconsByDeployMode: Record<DeployMode, DeployIosSplashscreens> = {
    'development': { iosSplashscreensPath: 'src/shared/assets-deploy-dev/ios-splashscreen' },
    'staging': { iosSplashscreensPath: 'src/shared/assets-deploy-stg/ios-splashscreen' },
    'production': { iosSplashscreensPath: 'src/shared/assets/ios-splashscreen' },
  }
  
  if (supportedDeployModes.includes(deployMode)) return iconsByDeployMode[deployMode]
  return iconsByDeployMode[deployModeDefault]
}
