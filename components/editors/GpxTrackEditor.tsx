"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import type { GpxTrack } from "@/types/config"

interface GpxTrackEditorProps {
  settingKey: string
  category: string
}

export function GpxTrackEditor({ settingKey, category }: GpxTrackEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state
  const settings = jsonConfig[category] || {}

  // Determine initial mode based on existing config
  const initialMode = (() => {
    if (!settings.spoofGpsTrack) return "disabled"
    const path = settings.spoofGpsTrackPath || ""
    if (path.startsWith("content://")) return "select"
    if (path) return "specify"
    return "disabled"
  })()

  const [mode, setMode] = useState<"disabled" | "select" | "specify">(initialMode)
  const [filePath, setFilePath] = useState(settings.spoofGpsTrackPath || "")
  const [duration, setDuration] = useState(settings.spoofGpsTrackDuration || 60)
  const [useElevation, setUseElevation] = useState(settings.spoofGpsTrackUseElevationFromFile || false)
  const [playbackMode, setPlaybackMode] = useState<"loop" | "bounce">(
    settings.spoofGpsTrackBounceMode ? "bounce" : "loop",
  )
  const [startPaused, setStartPaused] = useState(settings.spoofGpsTrackStartInPausedMode || false)
  const [loadedGpxTracks, setLoadedGpxTracks] = useState<GpxTrack[]>(settings.spoofGpsTracks || [])
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(settings.spoofGpsTrackIndex || 0)

  // Sync local state to global config
  useEffect(() => {
    const isEnabled = mode !== "disabled"

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrack", value: isEnabled },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackPath", value: isEnabled ? filePath : "" },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackDuration", value: isEnabled ? duration : 60 },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackUseElevationFromFile", value: isEnabled ? useElevation : false },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackBounceMode", value: isEnabled ? playbackMode === "bounce" : false },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackStartInPausedMode", value: isEnabled ? startPaused : false },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTracks", value: isEnabled && mode === "select" ? loadedGpxTracks : [] },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "spoofGpsTrackIndex", value: isEnabled && mode === "select" ? selectedTrackIndex : 0 },
    })
  }, [
    mode,
    filePath,
    duration,
    useElevation,
    playbackMode,
    startPaused,
    loadedGpxTracks,
    selectedTrackIndex,
    category,
    dispatch,
  ])

  const handleSelectFile = () => {
    if (typeof window !== "undefined" && (window as any).Android?.openGpxFilePicker) {
      ;(window as any).gpxFileCallback = (gpxData: any) => {
        if (gpxData && gpxData.tracks && Array.isArray(gpxData.tracks)) {
          setLoadedGpxTracks(gpxData.tracks)
          setSelectedTrackIndex(0) // Select the first track by default
          setFilePath(gpxData.uri || `content://loaded_gpx_file_${Date.now()}`) // Store a placeholder URI
        } else {
          alert("Failed to load GPX file or no tracks found.")
          setLoadedGpxTracks([])
          setSelectedTrackIndex(0)
          setFilePath("")
        }
        delete (window as any).gpxFileCallback
      }
      ;(window as any).Android.openGpxFilePicker("window.gpxFileCallback")
    } else {
      // Browser fallback - simulate loading a GPX file
      const sampleTracks: GpxTrack[] = [
        {
          trackName: "New file 1",
          trackPoints: [
            { alt: 10.5, lat: 30.192195, lng: -81.553611 },
            { alt: 10.5, lat: 30.192162, lng: -81.553573 },
            { alt: 10.0, lat: 30.192047, lng: -81.553442 },
            { alt: 9.25, lat: 30.191883, lng: -81.553255 },
            { alt: 8.75, lat: 30.191768, lng: -81.553124 },
            { alt: 8.25, lat: 30.191515, lng: -81.552837 },
            { alt: 8.25, lat: 30.191445, lng: -81.552881 },
            { alt: 8.75, lat: 30.191102, lng: -81.553396 },
            { alt: 7.75, lat: 30.19063, lng: -81.552863 },
            { alt: 7.75, lat: 30.190537, lng: -81.552833 },
            { alt: 7.5, lat: 30.190424, lng: -81.552915 },
            { alt: 7.25, lat: 30.190348, lng: -81.552946 },
            { alt: 7.0, lat: 30.190264, lng: -81.552959 },
            { alt: 6.75, lat: 30.190164, lng: -81.552963 },
            { alt: 6.25, lat: 30.190012, lng: -81.552957 },
            { alt: 6.5, lat: 30.18995, lng: -81.552958 },
            { alt: 10.75, lat: 30.189004, lng: -81.552964 },
            { alt: 11.0, lat: 30.188925, lng: -81.552971 },
            { alt: 11.5, lat: 30.188855, lng: -81.552984 },
            { alt: 11.75, lat: 30.18879, lng: -81.553005 },
            { alt: 12.0, lat: 30.188715, lng: -81.553036 },
            { alt: 12.25, lat: 30.188658, lng: -81.553077 },
            { alt: 12.5, lat: 30.188594, lng: -81.553158 },
            { alt: 13.0, lat: 30.188367, lng: -81.553517 },
            { alt: 13.0, lat: 30.188307, lng: -81.553595 },
            { alt: 12.25, lat: 30.188182, lng: -81.553709 },
            { alt: 11.75, lat: 30.188062, lng: -81.553804 },
            { alt: 11.0, lat: 30.188197, lng: -81.55406 },
            { alt: 11.0, lat: 30.188225, lng: -81.554125 },
            { alt: 10.5, lat: 30.188047, lng: -81.554152 },
            { alt: 10.75, lat: 30.187084, lng: -81.554296 },
            { alt: 12.75, lat: 30.186441, lng: -81.55437 },
            { alt: 13.5, lat: 30.186292, lng: -81.554387 },
            { alt: 13.5, lat: 30.186274, lng: -81.554399 },
            { alt: 13.5, lat: 30.186263, lng: -81.554419 },
            { alt: 13.5, lat: 30.186261, lng: -81.554452 },
            { alt: 12.0, lat: 30.186339, lng: -81.555168 },
            { alt: 11.5, lat: 30.186339, lng: -81.555229 },
            { alt: 11.5, lat: 30.186317, lng: -81.555286 },
            { alt: 11.25, lat: 30.186286, lng: -81.555308 },
            { alt: 11.5, lat: 30.186139, lng: -81.55533 },
            { alt: 11.5, lat: 30.185994, lng: -81.555351 },
            { alt: 11.5, lat: 30.185837, lng: -81.555378 },
            { alt: 11.25, lat: 30.1857, lng: -81.555395 },
            { alt: 10.75, lat: 30.185542, lng: -81.555418 },
            { alt: 9.75, lat: 30.185251, lng: -81.555462 },
            { alt: 9.25, lat: 30.185274, lng: -81.555719 },
            { alt: 9.0, lat: 30.185051, lng: -81.555727 },
            { alt: 9.0, lat: 30.184888, lng: -81.555753 },
            { alt: 9.0, lat: 30.184742, lng: -81.555779 },
            { alt: 9.0, lat: 30.184594, lng: -81.555806 },
            { alt: 9.0, lat: 30.184446, lng: -81.555831 },
            { alt: 8.75, lat: 30.184086, lng: -81.555894 },
            { alt: 8.75, lat: 30.183934, lng: -81.555919 },
            { alt: 8.75, lat: 30.183781, lng: -81.555936 },
            { alt: 8.5, lat: 30.183612, lng: -81.55595 },
            { alt: 8.5, lat: 30.183472, lng: -81.555917 },
            { alt: 8.75, lat: 30.183311, lng: -81.555867 },
            { alt: 8.75, lat: 30.183267, lng: -81.555854 },
            { alt: 8.75, lat: 30.183169, lng: -81.55581 },
            { alt: 8.75, lat: 30.183023, lng: -81.555745 },
            { alt: 9.0, lat: 30.182872, lng: -81.555661 },
            { alt: 9.0, lat: 30.182814, lng: -81.55563 },
            { alt: 9.0, lat: 30.182751, lng: -81.555582 },
            { alt: 9.25, lat: 30.182696, lng: -81.555522 },
            { alt: 9.5, lat: 30.182638, lng: -81.555431 },
            { alt: 9.75, lat: 30.182605, lng: -81.555355 },
            { alt: 10.5, lat: 30.182526, lng: -81.555096 },
            { alt: 10.75, lat: 30.182488, lng: -81.555036 },
            { alt: 10.5, lat: 30.182392, lng: -81.554942 },
            { alt: 7.5, lat: 30.182108, lng: -81.555337 },
            { alt: 6.25, lat: 30.181941, lng: -81.555436 },
            { alt: 5.25, lat: 30.181847, lng: -81.5556 },
            { alt: 5.0, lat: 30.181817, lng: -81.555673 },
            { alt: 5.0, lat: 30.181814, lng: -81.5557 },
            { alt: 4.5, lat: 30.181739, lng: -81.555707 },
            { alt: 4.75, lat: 30.181433, lng: -81.556112 },
            { alt: 5.0, lat: 30.181329, lng: -81.555995 },
            { alt: 5.0, lat: 30.18129, lng: -81.555976 },
            { alt: 5.25, lat: 30.181141, lng: -81.555813 },
            { alt: 5.25, lat: 30.181128, lng: -81.555808 },
            { alt: 5.5, lat: 30.181037, lng: -81.555928 },
            { alt: 5.75, lat: 30.181021, lng: -81.555935 },
            { alt: 5.75, lat: 30.181008, lng: -81.555932 },
            { alt: 7.25, lat: 30.180634, lng: -81.555549 },
            { alt: 8.75, lat: 30.180374, lng: -81.555891 },
            { alt: 9.25, lat: 30.180282, lng: -81.55602 },
            { alt: 9.5, lat: 30.180263, lng: -81.556072 },
            { alt: 9.75, lat: 30.180238, lng: -81.556138 },
            { alt: 10.0, lat: 30.180176, lng: -81.556312 },
            { alt: 13.5, lat: 30.17945, lng: -81.557272 },
            { alt: 13.25, lat: 30.179327, lng: -81.557149 },
            { alt: 13.25, lat: 30.179205, lng: -81.557026 },
            { alt: 15.0, lat: 30.178805, lng: -81.557528 },
            { alt: 15.5, lat: 30.178676, lng: -81.557409 },
            { alt: 16.0, lat: 30.178561, lng: -81.557558 },
            { alt: 16.0, lat: 30.178519, lng: -81.557613 },
            { alt: 16.25, lat: 30.178124, lng: -81.557214 },
            { alt: 16.0, lat: 30.177831, lng: -81.556918 },
            { alt: 16.0, lat: 30.17774, lng: -81.556886 },
            { alt: 15.5, lat: 30.177429, lng: -81.556599 },
            { alt: 15.25, lat: 30.177339, lng: -81.556516 },
            { alt: 15.0, lat: 30.177239, lng: -81.556404 },
            { alt: 14.25, lat: 30.177019, lng: -81.556315 },
            { alt: 13.75, lat: 30.176931, lng: -81.556288 },
            { alt: 13.25, lat: 30.176733, lng: -81.556242 },
            { alt: 12.25, lat: 30.17653, lng: -81.556313 },
            { alt: 11.5, lat: 30.176316, lng: -81.556372 },
            { alt: 11.25, lat: 30.176182, lng: -81.556385 },
            { alt: 10.5, lat: 30.175835, lng: -81.556404 },
            { alt: 10.0, lat: 30.175638, lng: -81.556399 },
            { alt: 8.75, lat: 30.174443, lng: -81.55637 },
          ],
        },
      ]
      setLoadedGpxTracks(sampleTracks)
      setSelectedTrackIndex(0)
      setFilePath(`content://simulated_gpx_file_${Date.now()}`)
      alert("Sample GPX track loaded for demo purposes.")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Spoof GPS track</h3>

      {/* Mode selection */}
      <div className="space-y-3">
        {[
          { value: "disabled", label: "Disabled" },
          { value: "select", label: "Select file" },
          { value: "specify", label: "Specify path" },
        ].map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <input
              type="radio"
              id={`gpx-mode-${option.value}`}
              name="gpx-mode"
              value={option.value}
              checked={mode === option.value}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`gpx-mode-${option.value}`} className="text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {mode !== "disabled" && (
        <div className="space-y-4 pl-6 border-l-2 border-gray-200">
          {/* File selection/path input */}
          {mode === "select" && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSelectFile}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Select GPX File...
              </button>

              {loadedGpxTracks.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loaded tracks</label>
                  <select
                    value={selectedTrackIndex}
                    onChange={(e) => setSelectedTrackIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {loadedGpxTracks.map((track, index) => (
                      <option key={index} value={index}>
                        {track.trackName || `Track ${index + 1}`} ({track.trackPoints?.length || 0} points)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {mode === "specify" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Path</label>
              <input
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/storage/emulated/0/track.gpx"
              />
            </div>
          )}

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <span className="text-gray-600">minutes</span>
            </div>
          </div>

          {/* Use elevation from file */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="use-elevation"
              checked={useElevation}
              onChange={(e) => setUseElevation(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="use-elevation" className="text-gray-700">
              Use elevation from file
            </label>
          </div>

          {/* Playback mode */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Playback mode</label>
            <div className="space-y-2">
              {[
                { value: "loop", label: "Loop" },
                { value: "bounce", label: "Bounce" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`playback-${option.value}`}
                    name="playback-mode"
                    value={option.value}
                    checked={playbackMode === option.value}
                    onChange={(e) => setPlaybackMode(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`playback-${option.value}`} className="text-gray-700">
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
            <label htmlFor="start-paused" className="text-gray-700">
              Start in paused mode
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
