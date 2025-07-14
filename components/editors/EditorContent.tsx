"use client"

import { useConfig } from "@/contexts/ConfigContext"
import { CUSTOM_EDITORS } from "@/constants/config"
import { SimpleEditor } from "./SimpleEditor"
import { ParentEditor } from "./ParentEditor"
import { DeleteOnExitEditor } from "./DeleteOnExitEditor"
import { BundleAppDataEditor } from "./BundleAppDataEditor"
import { HostsBlockerEditor } from "./HostsBlockerEditor"
import { WebViewUrlDataFilterEditor } from "./WebViewUrlDataFilterEditor"
import { OverridePreferencesEditor } from "./OverridePreferencesEditor"
import { CustomBuildPropsEditor } from "./CustomBuildPropsEditor"
import { WebViewCookieEditor } from "./WebViewCookieEditor"
import { WebViewOverrideUrlLoadingEditor } from "./WebViewOverrideUrlLoadingEditor"
import { SkipDialogsEditor } from "./SkipDialogsEditor"
import { PathPickerEditor } from "./PathPickerEditor"
import { GpxTrackEditor } from "./GpxTrackEditor" // Import the new editor

interface EditorContentProps {
  settingKey: string
  category: string
}

export function EditorContent({ settingKey, category }: EditorContentProps) {
  const { state } = useConfig()
  const { jsonConfig } = state

  // Determine which editor to use
  if (CUSTOM_EDITORS.includes(settingKey)) {
    switch (settingKey) {
      case "deleteOnExit":
        return <DeleteOnExitEditor settingKey={settingKey} category={category} />
      case "bundleAppData":
        return <BundleAppDataEditor settingKey={settingKey} category={category} />
      case "hostsBlocker":
        return <HostsBlockerEditor settingKey={settingKey} category={category} />
      case "webViewUrlDataFilterList":
        return <WebViewUrlDataFilterEditor settingKey={settingKey} category={category} />
      case "overrideSharedPreferences":
        return <OverridePreferencesEditor settingKey={settingKey} category={category} />
      case "customBuildProps":
        return <CustomBuildPropsEditor settingKey={settingKey} category={category} />
      case "webViewCookies":
        return <WebViewCookieEditor settingKey={settingKey} category={category} />
      case "webViewOverrideUrlLoadingList":
        return <WebViewOverrideUrlLoadingEditor settingKey={settingKey} category={category} />
      case "skipDialogsStrings":
        return <SkipDialogsEditor settingKey={settingKey} category={category} />
      case "bundleFilesDirectories":
      case "bundleInternalFilesDirectories":
        return <PathPickerEditor settingKey={settingKey} category={category} />
      case "spoofGpsTrack": // Route spoofGpsTrack to the new editor
        return <GpxTrackEditor settingKey={settingKey} category={category} />
      default:
        return <SimpleEditor settingKey={settingKey} category={category} />
    }
  }

  // Check if it's a parent setting
  if (state.allParentKeys.has(settingKey)) {
    return <ParentEditor settingKey={settingKey} category={category} />
  }

  // Check if it's a compound setting
  // (Add compound settings logic here if needed)

  // Default to simple editor
  return <SimpleEditor settingKey={settingKey} category={category} />
}
