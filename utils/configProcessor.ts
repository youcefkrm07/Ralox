import type { ConfigState } from "@/types/config"
import {
  keysWithCustomOption,
  CUSTOM_EDITORS,
  NON_INTERACTIVE_DIRECTORY_KEYS,
  KEYS_TO_UNICODE_ESCAPE,
} from "@/constants/config"

function customUnicodeEscape(str: string): string {
  if (typeof str !== "string" || !str) return str
  return str.replace(/[^a-zA-Z0-9\s_.,/:?*+$()[\]{}-]/g, (c) => {
    return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4)
  })
}

export function getUpdatedConfig(state: ConfigState) {
  const flatConfig: Record<string, any> = {}
  const tempConfig = JSON.parse(JSON.stringify(state.jsonConfig))

  for (const category in tempConfig) {
    const settings = tempConfig[category]
    for (const key in settings) {
      if (!settings.hasOwnProperty(key)) continue

      // Apply unicode escaping for specific keys
      if (key === "webViewUrlDataFilterList" && Array.isArray(settings[key])) {
        settings[key].forEach((item: any) => {
          if (item.urlExpression) item.urlExpression = customUnicodeEscape(item.urlExpression)
          if (item.urlReplacement) item.urlReplacement = customUnicodeEscape(item.urlReplacement)
          if (item.dataExpression) item.dataExpression = customUnicodeEscape(item.dataExpression)
          if (item.dataReplacement) item.dataReplacement = customUnicodeEscape(item.dataReplacement)
        })
      } else if (key === "webViewOverrideUrlLoadingList" && Array.isArray(settings[key])) {
        settings[key].forEach((item: any) => {
          if (item.urlExpression) item.urlExpression = customUnicodeEscape(item.urlExpression)
        })
      } else if (KEYS_TO_UNICODE_ESCAPE.includes(key) && typeof settings[key] === "string") {
        settings[key] = customUnicodeEscape(settings[key])
      }

      const value = settings[key]

      // Skip non-interactive directory keys
      if (NON_INTERACTIVE_DIRECTORY_KEYS.includes(key)) {
        flatConfig[key] = state.originalJsonConfig[category][key]
        continue
      }

      // Handle spoofGpsTrack and its related keys
      if (key === "spoofGpsTrack") {
        if (value === true) {
          // If spoofGpsTrack is enabled, include all related settings
          flatConfig[key] = true
          flatConfig["spoofGpsTrackPath"] = settings["spoofGpsTrackPath"] || ""
          flatConfig["spoofGpsTrackDuration"] = settings["spoofGpsTrackDuration"] || 60
          flatConfig["spoofGpsTrackUseElevationFromFile"] = settings["spoofGpsTrackUseElevationFromFile"] || false
          flatConfig["spoofGpsTrackBounceMode"] = settings["spoofGpsTrackBounceMode"] || false
          flatConfig["spoofGpsTrackStartInPausedMode"] = settings["spoofGpsTrackStartInPausedMode"] || false
          flatConfig["spoofGpsTracks"] = settings["spoofGpsTracks"] || []
          flatConfig["spoofGpsTrackIndex"] = settings["spoofGpsTrackIndex"] || 0
        } else {
          // If spoofGpsTrack is disabled, set it to false and ensure related keys are not included or reset
          flatConfig[key] = false
          // Explicitly set related keys to their default/false values or omit them if not needed
          // For simplicity, we'll set them to defaults here.
          flatConfig["spoofGpsTrackPath"] = ""
          flatConfig["spoofGpsTrackDuration"] = 60
          flatConfig["spoofGpsTrackUseElevationFromFile"] = false
          flatConfig["spoofGpsTrackBounceMode"] = false
          flatConfig["spoofGpsTrackStartInPausedMode"] = false
          flatConfig["spoofGpsTracks"] = []
          flatConfig["spoofGpsTrackIndex"] = 0
        }
        continue // Skip further processing for this key and its children
      }

      // Skip child keys that have real parents (including GPX track children handled above)
      if (state.allChildKeys.has(key)) {
        let hasRealParent = false
        for (const [p, children] of state.parentChildMap.entries()) {
          if (children.includes(key) && settings.hasOwnProperty(p)) {
            hasRealParent = true
            break
          }
        }
        if (hasRealParent) continue
      }

      const isObjectParent = typeof value === "object" && value !== null && !Array.isArray(value)
      const isBooleanParent = state.allParentKeys.has(key) && typeof value === "boolean"

      if (isObjectParent) {
        if (value.enabled) {
          flatConfig[key] = value
          const externalChildren = (state.parentChildMap.get(key) || []).filter((c) => !value.hasOwnProperty(c))
          if (externalChildren.length > 0) {
            externalChildren.forEach((childKey) => {
              if (settings[childKey] !== undefined) flatConfig[childKey] = settings[childKey]
            })
          }
        } else {
          flatConfig[key] = false
        }
        continue
      }

      if (isBooleanParent) {
        if (value) {
          flatConfig[key] = true
          ;(state.parentChildMap.get(key) || []).forEach((childKey) => {
            if (settings[childKey] !== undefined) flatConfig[childKey] = settings[childKey]
          })
        } else {
          if (key === "deleteOnExit") {
            flatConfig["deleteFilesDirectoriesOnExit"] =
              state.originalJsonConfig[category]?.deleteFilesDirectoriesOnExit ?? false
            flatConfig["securelyDeleteFilesDirectoriesOnExit"] =
              state.originalJsonConfig[category]?.securelyDeleteFilesDirectoriesOnExit ?? false
          } else {
            flatConfig[key] = false
          }
        }
        continue
      }

      const originalValue = state.originalJsonConfig[category]?.[key]
      if (
        keysWithCustomOption.includes(key) &&
        Array.isArray(value) &&
        Array.isArray(originalValue) &&
        value.length === 1 &&
        !originalValue.includes(value[0])
      ) {
        flatConfig[key] = "CUSTOM"
        flatConfig["custom" + key.charAt(6).toUpperCase() + key.slice(7)] = value[0]
      } else if (
        Array.isArray(value) &&
        !CUSTOM_EDITORS.includes(key) &&
        !key.toLowerCase().includes("strings") &&
        !key.toLowerCase().includes("filters")
      ) {
        flatConfig[key] = value[0]
      } else {
        flatConfig[key] = value
      }
    }
  }
  return flatConfig
}
