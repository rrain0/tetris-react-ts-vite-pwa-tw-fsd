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
    development: { iosSplashscreensPath: './src/shared/assets/im/ios-splashscreen-dev' },
    staging: { iosSplashscreensPath: './src/shared/assets/im/ios-splashscreen-stg' },
    production: { iosSplashscreensPath: './src/shared/assets/im/ios-splashscreen' },
  }
  
  if (supportedDeployModes.includes(deployMode)) return iconsByDeployMode[deployMode]
  return iconsByDeployMode[deployModeDefault]
}
