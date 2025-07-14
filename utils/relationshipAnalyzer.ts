import type { JsonConfig } from "@/types/config"

export function analyzeParentChildRelationships(jsonConfig: JsonConfig) {
  const allChildKeys = new Set<string>()
  const allParentKeys = new Set<string>()
  const parentChildMap = new Map<string, string[]>()

  // Analyze object-based parent-child relationships
  for (const category in jsonConfig) {
    const settings = jsonConfig[category]
    for (const key in settings) {
      if (typeof settings[key] === "object" && settings[key] !== null && !Array.isArray(settings[key])) {
        allParentKeys.add(key)
        const children = Object.keys(settings[key]).filter((childKey) => childKey !== "enabled")
        parentChildMap.set(key, children)
        children.forEach((child) => allChildKeys.add(child))
      }
    }
  }

  // Manual boolean parent mappings
  const manualBooleanParents: Record<string, string> = {
    addSnow: "snow",
    pictureInPictureSupport: "pictureInPicture",
    buildsProps: "buildProps",
  }

  // Explicit parent-child groups
  const explicitParentChildGroups: Record<string, string[]> = {
    hostsBlocker: [
      "hostsBlockerBlockByDefault",
      "hostsBlockerShowNotification",
      "hostsBlockerUseFile",
      "hostsBlockerFileContent",
      "hostsBlockerAllowAllOtherHosts",
    ],
    bundleAppData: [
      "bundleAppDataPath",
      "bundleAppDataPassword",
      "bundleAppDataEncryptCertificate",
      "restoreAppDataOnEveryStart",
    ],
    deleteOnExit: ["deleteFilesDirectoriesOnExit", "securelyDeleteFilesDirectoriesOnExit"],
    changeInstallUpdateTime: [
      "customInstallUpdateTime",
      "randomizeUserCreationTime",
      "relativeInstallUpdateTime",
      "relativeInstallUpdateTimeUnit",
    ],
    randomizeBuildProps: [
      "filterDevicesDatabase",
      "devicesDatabaseFilters",
      "devicesDatabaseUseAndroidVersion",
      "devicesDatabaseSdkVersions",
      "randomizeBuildPropsDeviceNamePrefix",
    ],
    spoofLocation: [
      "spoofLocationLatitude",
      "spoofLocationLongitude",
      "spoofRandomLocation",
      "spoofLocationUseIpLocation",
      "spoofLocationApi",
      "spoofLocationCalculateBearing",
      "spoofLocationCompatibilityMode",
      "spoofLocationInterval",
      "spoofLocationShareLocationReceiver",
      "spoofLocationShowSpoofLocationNotification",
      "spoofLocationSimulatePositionalUncertainty",
      "favoriteLocationsShowDistance",
    ],
    webViewPrivacyOptions: ["webViewDisableWebRtc", "webViewDisableWebGl", "webViewDisableAudioContext"],
    webViewUrlDataMonitor: [
      "webViewUrlDataMonitorAutoCopy",
      "webViewUrlDataMonitorAutoOpen",
      "webViewUrlDataMonitorFilter",
      "webViewUrlDataMonitorFilterStrings",
      "webViewUrlDataMonitorRegularExpression",
      "webViewUrlDataMonitorShowJavaScriptUrls",
      "webViewUrlDataMonitorShowOverrideUrlLoading",
      "webViewUrlDataMonitorUrlDecode",
    ],
    showWebViewSourceCode: [
      "showWebViewIFrameSourceCode",
      "showWebViewSourceCodeFilter",
      "showWebViewSourceCodeFilterStrings",
      "showWebViewSourceCodeRegularExpression",
    ],
  }

  // Process boolean-based parent relationships
  for (const category in jsonConfig) {
    const settings = jsonConfig[category]

    // Auto-detect boolean parents
    for (const key in settings) {
      if (typeof settings[key] === "boolean") {
        const relatedKeys = Object.keys(settings).filter(
          (otherKey) =>
            key !== otherKey &&
            otherKey.startsWith(key) &&
            otherKey.length > key.length &&
            otherKey.charAt(key.length) === otherKey.charAt(key.length).toUpperCase(),
        )
        if (relatedKeys.length > 0) {
          allParentKeys.add(key)
          parentChildMap.set(key, relatedKeys)
          relatedKeys.forEach((child) => allChildKeys.add(child))
        }
      }
    }

    // Process manual boolean parents
    for (const parentKey in manualBooleanParents) {
      if (settings.hasOwnProperty(parentKey)) {
        const prefix = manualBooleanParents[parentKey]
        const children = Object.keys(settings).filter((k) => k.startsWith(prefix) && k !== parentKey)
        if (children.length > 0) {
          allParentKeys.add(parentKey)
          parentChildMap.set(parentKey, children)
          children.forEach((child) => allChildKeys.add(child))
        }
      }
    }

    // Process explicit parent-child groups
    for (const parentKey in explicitParentChildGroups) {
      const children = explicitParentChildGroups[parentKey]
      if (children.some((child) => settings.hasOwnProperty(child)) || settings.hasOwnProperty(parentKey)) {
        allParentKeys.add(parentKey)
        parentChildMap.set(parentKey, children)
        children.forEach((child) => allChildKeys.add(child))

        if (!settings.hasOwnProperty(parentKey)) {
          if (parentKey === "deleteOnExit") {
            settings[parentKey] = Array.isArray(settings.deleteFilesDirectoriesOnExit)
          } else {
            settings[parentKey] = true
          }
        }
      }
    }

    // Handle placeholder children
    const placeholderChildSuffix = "EnablePlaceholders"
    for (const key in settings) {
      if (key.startsWith("custom") && key.endsWith(placeholderChildSuffix)) {
        const middlePart = key.substring("custom".length, key.length - placeholderChildSuffix.length)
        const potentialParentKey = "change" + middlePart
        if (settings.hasOwnProperty(potentialParentKey)) {
          allParentKeys.add(potentialParentKey)
          allChildKeys.add(key)
          const existingChildren = parentChildMap.get(potentialParentKey) || []
          parentChildMap.set(potentialParentKey, [...new Set([...existingChildren, key])])
        }
      }
    }
  }

  return {
    allChildKeys,
    allParentKeys,
    parentChildMap,
  }
}
