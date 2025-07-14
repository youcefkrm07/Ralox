"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import { SimpleEditor } from "./SimpleEditor"
import { formatLabel } from "@/utils/formatters"
import { generateRealisticCoordinates } from "@/utils/generators"

interface ParentEditorProps {
  settingKey: string
  category: string
}

export function ParentEditor({ settingKey, category }: ParentEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  const value = jsonConfig[category]?.[settingKey]
  const children = state.parentChildMap.get(settingKey) || []

  const isObjectType = typeof value === "object" && value !== null && !Array.isArray(value)
  const [isEnabled, setIsEnabled] = useState(isObjectType ? value.enabled : value)

  useEffect(() => {
    if (isObjectType) {
      dispatch({
        type: "UPDATE_SETTING",
        payload: {
          category,
          key: settingKey,
          value: { ...value, enabled: isEnabled },
        },
      })
    } else {
      dispatch({
        type: "UPDATE_SETTING",
        payload: { category, key: settingKey, value: isEnabled },
      })
    }
  }, [isEnabled, isObjectType, value, category, settingKey, dispatch])

  // Special handling for spoofLocation
  if (settingKey === "spoofLocation") {
    return <SpoofLocationEditor category={category} isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
  }

  return (
    <div className="space-y-6">
      {/* Parent toggle */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id={`${settingKey}-enabled`}
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor={`${settingKey}-enabled`} className="font-medium text-gray-700">
          {formatLabel(settingKey)}
        </label>
      </div>

      {/* Child settings */}
      {isEnabled && children.length > 0 && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          {children.map((childKey) => {
            const isInternalChild = isObjectType && value.hasOwnProperty(childKey)
            const childValue = isInternalChild ? value[childKey] : jsonConfig[category][childKey]

            if (childValue !== undefined) {
              return <SimpleEditor key={childKey} settingKey={childKey} category={category} />
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}

// Specialized component for spoof location with map and GPX tracks
function SpoofLocationEditor({
  category,
  isEnabled,
  setIsEnabled,
}: {
  category: string
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
}) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  const [latitude, setLatitude] = useState(jsonConfig[category]?.spoofLocationLatitude || "")
  const [longitude, setLongitude] = useState(jsonConfig[category]?.spoofLocationLongitude || "")

  // GPX Track settings
  const [gpsTrackMode, setGpsTrackMode] = useState(() => {
    const tracks = jsonConfig[category]?.spoofGpsTracks
    if (Array.isArray(tracks) && tracks.length > 0) {
      return "select" // Has loaded tracks
    }
    return "disabled"
  })

  const [duration, setDuration] = useState(jsonConfig[category]?.spoofGpsTrackDuration || 60)
  const [useElevation, setUseElevation] = useState(jsonConfig[category]?.spoofGpsTrackUseElevationFromFile || false)
  const [bounceMode, setBounceMode] = useState(jsonConfig[category]?.spoofGpsTrackBounceMode || false)
  const [startPaused, setStartPaused] = useState(jsonConfig[category]?.spoofGpsTrackStartInPausedMode || false)
  const [gpsTracks, setGpsTracks] = useState(jsonConfig[category]?.spoofGpsTracks || [])
  const [trackIndex, setTrackIndex] = useState(jsonConfig[category]?.spoofGpsTrackIndex || 0)

  // Update coordinates in config
  useEffect(() => {
    if (latitude !== "") {
      dispatch({
        type: "UPDATE_SETTING",
        payload: { category, key: "spoofLocationLatitude", value: latitude },
      })
    }
  }, [latitude, category, dispatch])

  useEffect(() => {
    if (longitude !== "") {
      dispatch({
        type: "UPDATE_SETTING",
        payload: { category, key: "spoofLocationLongitude", value: longitude },
      })
    }
  }, [longitude, category, dispatch])

  // Update GPX settings in config
  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackDuration", value: duration },
    })
  }, [duration, category, dispatch])

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackUseElevationFromFile", value: useElevation },
    })
  }, [useElevation, category, dispatch])

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackBounceMode", value: bounceMode },
    })
  }, [bounceMode, category, dispatch])

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackStartInPausedMode", value: startPaused },
    })
  }, [startPaused, category, dispatch])

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTracks", value: gpsTracks },
    })
  }, [gpsTracks, category, dispatch])

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackIndex", value: trackIndex },
    })
  }, [trackIndex, category, dispatch])

  const updateMapDot = (lat: string, lon: string) => {
    const latNum = Number.parseFloat(lat)
    const lonNum = Number.parseFloat(lon)

    const mapDot = document.getElementById("map-dot")
    if (!mapDot) return

    if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      mapDot.style.display = "none"
      return
    }

    mapDot.style.display = "block"
    const x = (((lonNum + 180) % 360) / 360) * 100
    const y = ((-1 * latNum + 90) / 180) * 100
    mapDot.style.left = `${x}%`
    mapDot.style.top = `${y}%`
  }

  useEffect(() => {
    updateMapDot(latitude, longitude)
  }, [latitude, longitude])

  const handleRandomize = () => {
    const coords = generateRealisticCoordinates()
    setLatitude(coords.latitude)
    setLongitude(coords.longitude)
  }

  const handlePickPlace = () => {
    alert("Place picker would open here (requires Google Maps integration)")
  }

  const handleLoadGpxFile = () => {
    if (typeof window !== "undefined" && (window as any).Android?.openGpxFilePicker) {
      ;(window as any).gpxFileCallback = (gpxData: any) => {
        if (gpxData && gpxData.tracks) {
          setGpsTracks(gpxData.tracks)
          setGpsTrackMode("select")
          setTrackIndex(0)
        }
        delete (window as any).gpxFileCallback
      }
      ;(window as any).Android.openGpxFilePicker("window.gpxFileCallback")
    } else {
      // Browser fallback - simulate loading a GPX file
      const sampleTrack = {
        trackName: "Sample Track",
        trackPoints: [
          { lat: 40.7128, lng: -74.006, alt: 10.0 },
          { lat: 40.713, lng: -74.0058, alt: 10.5 },
          { lat: 40.7132, lng: -74.0056, alt: 11.0 },
        ],
      }
      setGpsTracks([sampleTrack])
      setGpsTrackMode("select")
      setTrackIndex(0)
      alert("Sample GPX track loaded for demo purposes")
    }
  }

  // Get other children (excluding GPS track and lat/lon settings)
  const children = state.parentChildMap.get("spoofLocation") || []
  const excludedChildren = [
    "spoofLocationLatitude",
    "spoofLocationLongitude",
    "spoofGpsTrackDuration",
    "spoofGpsTrackUseElevationFromFile",
    "spoofGpsTrackBounceMode",
    "spoofGpsTrackStartInPausedMode",
    "spoofGpsTracks",
    "spoofGpsTrackIndex",
  ]
  const otherChildren = children.filter((child) => !excludedChildren.includes(child))

  return (
    <div className="space-y-6">
      {/* Main toggle */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="spoof-location-enabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="spoof-location-enabled" className="font-medium text-gray-700">
          Spoof Location
        </label>
      </div>

      {isEnabled && (
        <div className="space-y-6 pl-4 border-l-2 border-gray-200">
          {/* GPS Track Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Spoof GPS track</h3>

            {/* Track mode selection */}
            <div className="space-y-3">
              {[
                { value: "disabled", label: "Disabled" },
                { value: "select", label: "Select file" },
                { value: "specify", label: "Specify path" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`gps-track-${option.value}`}
                    name="gps-track-mode"
                    value={option.value}
                    checked={gpsTrackMode === option.value}
                    onChange={(e) => setGpsTrackMode(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`gps-track-${option.value}`} className="text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>

            {gpsTrackMode === "select" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleLoadGpxFile}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Load GPX File
                </button>

                {gpsTracks.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loaded tracks ({gpsTracks.length})
                    </label>
                    <select
                      value={trackIndex}
                      onChange={(e) => setTrackIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {gpsTracks.map((track, index) => (
                        <option key={index} value={index}>
                          {track.trackName || `Track ${index + 1}`} ({track.trackPoints?.length || 0} points)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {gpsTrackMode !== "disabled" && (
              <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                    <span className="text-gray-600">minutes</span>
                  </div>
                </div>

                {/* Use elevation checkbox */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="use-elevation"
                    checked={useElevation}
                    onChange={(e) => setUseElevation(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="use-elevation" className="text-sm text-gray-700">
                    Use elevation from file
                  </label>
                </div>

                {/* Playback mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Playback mode</label>
                  <div className="space-y-2">
                    {[
                      { value: false, label: "Loop" },
                      { value: true, label: "Bounce" },
                    ].map((option) => (
                      <div key={option.label} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={`playback-${option.label.toLowerCase()}`}
                          name="playback-mode"
                          checked={bounceMode === option.value}
                          onChange={() => setBounceMode(option.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`playback-${option.label.toLowerCase()}`} className="text-sm text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start in paused mode */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="start-paused"
                    checked={startPaused}
                    onChange={(e) => setStartPaused(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="start-paused" className="text-sm text-gray-700">
                    Start in paused mode
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Static coordinates section - only show when GPS track is disabled */}
          {gpsTrackMode === "disabled" && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Static Location</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 40.7128"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., -74.0060"
                  />
                </div>
              </div>

              {/* World map with dot */}
              <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1200px-World_map_blank_without_borders.svg.png"
                  alt="World Map"
                  className="w-full h-64 object-cover bg-gray-900"
                />
                <div
                  id="map-dot"
                  className="absolute w-3 h-3 bg-red-500 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 hidden"
                  style={{ zIndex: 10 }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePickPlace}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Pick place
                </button>
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Randomize
                </button>
              </div>
            </div>
          )}

          {/* Other spoof location options */}
          {otherChildren.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Other Options</h4>
              {otherChildren.map((childKey) => {
                const childValue = jsonConfig[category][childKey]
                if (childValue !== undefined) {
                  return <SimpleEditor key={childKey} settingKey={childKey} category={category} />
                }
                return null
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
