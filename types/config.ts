export interface JsonConfig {
  [category: string]: {
    [key: string]: any
  }
}

export interface DeviceProfile {
  displayName: string
  props: Record<string, string>
}

export interface ParsedDevice {
  manufacturer: string
  brand: string
  model: string
  device: string
  sdks: number[]
}

export interface GpxTrackPoint {
  alt?: number
  lat: number
  lng: number
}

export interface GpxTrack {
  trackName: string
  trackPoints: GpxTrackPoint[]
}

export interface ConfigState {
  jsonConfig: JsonConfig
  originalJsonConfig: JsonConfig
  currentPackageName: string
  configFileSplitCount: number
  allChildKeys: Set<string>
  allParentKeys: Set<string>
  parentChildMap: Map<string, string[]>
  parsedDevices: ParsedDevice[]
  deviceProfiles: DeviceProfile[]
  isLoading: boolean
  error: string | null
}

export type ConfigAction =
  | { type: "SET_CONFIG"; payload: { jsonConfig: JsonConfig; originalJsonConfig: JsonConfig } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "UPDATE_SETTING"; payload: { category: string; key: string; value: any } }
  | {
      type: "SET_RELATIONSHIPS"
      payload: { allChildKeys: Set<string>; allParentKeys: Set<string>; parentChildMap: Map<string, string[]> }
    }
  | { type: "SET_DEVICES"; payload: { parsedDevices: ParsedDevice[]; deviceProfiles: DeviceProfile[] } }
  | { type: "SET_PACKAGE_NAME"; payload: string }
  | { type: "SET_SPLIT_COUNT"; payload: number }

export interface AndroidSDKVersion {
  sdk: number
  name: string
}

export interface WebViewUrlFilter {
  urlExpression: string
  urlExpressionBlockOnMatch: boolean
  urlReplacement: string
  urlReplacementUrlEncode: boolean
  dataExpression: string
  dataExpressionIgnoreCase: boolean
  dataExpressionBlockOnMatch: boolean
  dataReplacement: string
  dataReplacementReplaceAll: boolean
}

export interface WebViewCookie {
  name: string
  path: string
  url: string
  value: string
}

export interface CustomBuildProp {
  name: string
  value: string
}

export interface SharedPreference {
  name: string
  nameRegExp: boolean
  value: string
}

export interface WebViewOverrideUrlLoading {
  urlExpression: string
  overrideUrlLoading: boolean
}
