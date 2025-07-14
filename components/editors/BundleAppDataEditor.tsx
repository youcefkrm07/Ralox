"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"

interface BundleAppDataEditorProps {
  settingKey: string
  category: string
}

export function BundleAppDataEditor({ settingKey, category }: BundleAppDataEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state
  const settings = jsonConfig[category] || {}

  const [mode, setMode] = useState<"disabled" | "select" | "specify">("disabled")
  const [path, setPath] = useState(settings.bundleAppDataPath || "")
  const [password, setPassword] = useState(settings.bundleAppDataPassword || "")
  const [showPassword, setShowPassword] = useState(false)
  const [encryptCertificate, setEncryptCertificate] = useState(settings.bundleAppDataEncryptCertificate || false)
  const [restoreOnStart, setRestoreOnStart] = useState(settings.restoreAppDataOnEveryStart || false)

  useEffect(() => {
    // Determine current mode
    if (settings.bundleAppData) {
      const currentPath = settings.bundleAppDataPath || ""
      setMode(currentPath.startsWith("content://") ? "select" : "specify")
    } else {
      setMode("disabled")
    }
  }, [settings.bundleAppData, settings.bundleAppDataPath])

  useEffect(() => {
    // Update config when state changes
    const isEnabled = mode !== "disabled"

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: isEnabled },
    })

    if (isEnabled) {
      dispatch({
        type: "UPDATE_SETTING",
        payload: { category, key: "bundleAppDataPath", value: path },
      })
    }

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "bundleAppDataPassword", value: password },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "bundleAppDataEncryptCertificate", value: encryptCertificate },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "restoreAppDataOnEveryStart", value: restoreOnStart },
    })
  }, [mode, path, password, encryptCertificate, restoreOnStart, category, settingKey, dispatch])

  const handleSelectFile = () => {
    if (typeof window !== "undefined" && (window as any).Android?.openAppDataPicker) {
      ;(window as any).appDataFileCallback = (uri: string) => {
        if (uri) {
          setPath(uri)
        }
        delete (window as any).appDataFileCallback
      }
      ;(window as any).Android.openAppDataPicker("window.appDataFileCallback")
    } else {
      const filePath = prompt("Enter the path to the app data file:", "")
      if (filePath) {
        setPath(filePath)
      }
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Please select a previously exported app data file from the same app.</p>

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
              id={`bundle-mode-${option.value}`}
              name="bundle-mode"
              value={option.value}
              checked={mode === option.value}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`bundle-mode-${option.value}`} className="text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {mode !== "disabled" && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          {/* File selection */}
          <div className="space-y-2">
            {mode === "select" && (
              <button
                type="button"
                onClick={handleSelectFile}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Select App Data File...
              </button>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                readOnly={mode === "select"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password section */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">If the app data was exported with a password, specify it here.</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show-password" className="text-sm text-gray-700">
                Show password
              </label>
            </div>
          </div>

          {/* Other options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="encrypt-certificate"
                checked={encryptCertificate}
                onChange={(e) => setEncryptCertificate(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="encrypt-certificate" className="text-sm text-gray-700">
                Encrypt app data with custom certificate
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="restore-on-start"
                checked={restoreOnStart}
                onChange={(e) => setRestoreOnStart(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="restore-on-start" className="text-sm text-gray-700">
                Restore app data on every start of the app
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
