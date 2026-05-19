import { deployModeDefault } from '../deployMode.ts'
import { deployLocaleDefault } from '../locale/getAppDeployLocaleData.ts'
import { deployThemeDefault } from '../theme/getAppDeployThemeData.ts'



export function getAppManifestSearchParams({ deployMode, locale, theme }: {
  deployMode: string
  locale: string
  theme: string
}) {
  let manifestSearchParams = new URLSearchParams({
    ...deployMode && deployMode !== deployModeDefault && { deployMode },
    ...locale && locale !== deployLocaleDefault && { locale },
    ...theme && theme !== deployThemeDefault && { theme },
  }).toString()
  if (manifestSearchParams) manifestSearchParams = '?' + manifestSearchParams
  return manifestSearchParams
}
