export const NON_INTERACTIVE_DIRECTORY_KEYS = [
  "addPermissions",
  "addProviders",
  "addReceivers",
  "addServices",
  "addActivities",
  "stringsProperties",
  "serialFormat",
]

export const CUSTOM_EDITORS = [
  "webViewUrlDataFilterList",
  "overrideSharedPreferences",
  "customBuildProps",
  "webViewCookies",
  "webViewOverrideUrlLoadingList",
  "skipDialogsStrings",
  "bundleFilesDirectories",
  "bundleInternalFilesDirectories",
  "hostsBlocker",
  "bundleAppData",
  "deleteOnExit",
  "spoofGpsTrack", // Add spoofGpsTrack to custom editors
]

export const keysWithCustomOption = [
  "changeAndroidId",
  "changeImei",
  "changeAndroidSerial",
  "changeWifiMacAddress",
  "changeBluetoothMacAddress",
  "changeImsi",
  "changeGoogleAdvertisingId",
  "changeGoogleServiceFrameworkId",
  "changeFacebookAttributionId",
  "changeAppSetId",
  "changeOpenId",
  "changeAmazonAdvertisingId",
  "changeHuaweiAdvertisingId",
  "changeLocale",
  "changeEthernetMacAddress",
]

export const KEYS_TO_UNICODE_ESCAPE = ["customBuildPropsFile"]

export const ANDROID_SDK_VERSIONS = [
  { sdk: 23, name: "Android 6.0 (Marshmallow)" },
  { sdk: 24, name: "Android 7.0 (Nougat)" },
  { sdk: 25, name: "Android 7.1 (Nougat)" },
  { sdk: 26, name: "Android 8.0 (Oreo)" },
  { sdk: 27, name: "Android 8.1 (Oreo)" },
  { sdk: 28, name: "Android 9 (Pie)" },
  { sdk: 29, name: "Android 10" },
  { sdk: 30, name: "Android 11" },
  { sdk: 31, name: "Android 12" },
  { sdk: 32, name: "Android 12L" },
  { sdk: 33, name: "Android 13" },
  { sdk: 34, name: "Android 14" },
].reverse()
