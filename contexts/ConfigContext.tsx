"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { ConfigState, ConfigAction } from "@/types/config"
import { loadConfiguration } from "@/utils/configLoader"
import { analyzeParentChildRelationships } from "@/utils/relationshipAnalyzer"

const initialState: ConfigState = {
  jsonConfig: {},
  originalJsonConfig: {},
  currentPackageName: "",
  configFileSplitCount: 101,
  allChildKeys: new Set(),
  allParentKeys: new Set(),
  parentChildMap: new Map(),
  parsedDevices: [],
  deviceProfiles: [],
  isLoading: true,
  error: null,
}

function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        jsonConfig: action.payload.jsonConfig,
        originalJsonConfig: action.payload.originalJsonConfig,
        isLoading: false,
        error: null,
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }
    case "UPDATE_SETTING":
      const { category, key, value } = action.payload
      return {
        ...state,
        jsonConfig: {
          ...state.jsonConfig,
          [category]: {
            ...state.jsonConfig[category],
            [key]: value,
          },
        },
      }
    case "SET_RELATIONSHIPS":
      return {
        ...state,
        allChildKeys: action.payload.allChildKeys,
        allParentKeys: action.payload.allParentKeys,
        parentChildMap: action.payload.parentChildMap,
      }
    case "SET_DEVICES":
      return {
        ...state,
        parsedDevices: action.payload.parsedDevices,
        deviceProfiles: action.payload.deviceProfiles,
      }
    case "SET_PACKAGE_NAME":
      return { ...state, currentPackageName: action.payload }
    case "SET_SPLIT_COUNT":
      return { ...state, configFileSplitCount: action.payload }
    default:
      return state
  }
}

const ConfigContext = createContext<{
  state: ConfigState
  dispatch: React.Dispatch<ConfigAction>
} | null>(null)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(configReducer, initialState)

  useEffect(() => {
    const initializeConfig = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const { jsonConfig, originalJsonConfig, parsedDevices, deviceProfiles } = await loadConfiguration()

        // Initialize GPX related settings if they don't exist
        const privacySettings = jsonConfig.privacy || {}
        if (privacySettings.spoofGpsTrack === undefined) privacySettings.spoofGpsTrack = false
        if (privacySettings.spoofGpsTrackPath === undefined) privacySettings.spoofGpsTrackPath = ""
        if (privacySettings.spoofGpsTrackDuration === undefined) privacySettings.spoofGpsTrackDuration = 60
        if (privacySettings.spoofGpsTrackUseElevationFromFile === undefined)
          privacySettings.spoofGpsTrackUseElevationFromFile = false
        if (privacySettings.spoofGpsTrackBounceMode === undefined) privacySettings.spoofGpsTrackBounceMode = false
        if (privacySettings.spoofGpsTrackStartInPausedMode === undefined)
          privacySettings.spoofGpsTrackStartInPausedMode = false
        if (privacySettings.spoofGpsTracks === undefined) privacySettings.spoofGpsTracks = []
        if (privacySettings.spoofGpsTrackIndex === undefined) privacySettings.spoofGpsTrackIndex = 0

        jsonConfig.privacy = privacySettings // Ensure privacy category exists and is updated

        dispatch({
          type: "SET_CONFIG",
          payload: { jsonConfig, originalJsonConfig },
        })

        dispatch({
          type: "SET_DEVICES",
          payload: { parsedDevices, deviceProfiles },
        })

        const relationships = analyzeParentChildRelationships(jsonConfig)
        dispatch({
          type: "SET_RELATIONSHIPS",
          payload: relationships,
        })
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "Failed to load configuration",
        })
      }
    }

    initializeConfig()
  }, [])

  return <ConfigContext.Provider value={{ state, dispatch }}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}
