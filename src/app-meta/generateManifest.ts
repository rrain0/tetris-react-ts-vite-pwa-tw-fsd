import manifestBase from './manifest.base.json'
import { type ManifestOptions } from 'vite-plugin-pwa'



export function generateManifest(
  buildMode: string,
  appLang: string,
  appName: string,
  appDescription: string,
) {
  let manifest = manifestBase as ManifestPart
  manifest = applyAppMeta(manifest, appLang, appName, appDescription)
  manifest = applyPwaId(manifest, buildMode, appLang)
  return manifest
}



type ManifestPart = Partial<ManifestOptions>

function applyAppMeta(
  manifest: ManifestPart,
  appLang: string,
  appName: string,
  appDescription: string,
): ManifestPart {
  return {
    ...manifest,
    lang: appLang,
    name: appName,
    short_name: appName,
    description: appDescription,
  }
}

function getPwaId(buildMode: string, lang: string) {
  const project = 'tetris'
  const framework = 'react'
  return [project, buildMode, framework, lang].filter(it => !!it).join('-')
}

function applyPwaId(manifest: ManifestPart, buildMode: string, lang: string): ManifestPart {
  return { ...manifest, id: getPwaId(buildMode, lang) }
}