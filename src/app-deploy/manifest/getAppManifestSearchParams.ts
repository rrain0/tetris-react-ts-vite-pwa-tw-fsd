import { deployModeDefault } from '../deployMode.model.ts'
import { deployLocaleDefault } from '../locale/deployLocale.model.ts'
import type { Platform } from '../platform.model.ts'
import { deployThemeDefault } from '../theme/getAppDeployThemeData.ts'



export function getAppManifestSearchParams({ deployMode, locale, theme, platform }: {
  deployMode: string
  locale: string
  theme: string
  platform?: Platform | undefined
}) {
  let manifestSearchParams = new URLSearchParams({
    ...deployMode && deployMode !== deployModeDefault && { deployMode },
    ...locale && locale !== deployLocaleDefault && { locale },
    ...theme && theme !== deployThemeDefault && { theme },
    ...platform && { platform },
  }).toString()
  if (manifestSearchParams) manifestSearchParams = '?' + manifestSearchParams
  return manifestSearchParams
}
