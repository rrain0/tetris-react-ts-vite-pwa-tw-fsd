


export const supportedDeployModes = ['development', 'staging', 'production'] as const
export type DeployMode = typeof supportedDeployModes[number]
export const deployModeDefault: DeployMode = 'production'
