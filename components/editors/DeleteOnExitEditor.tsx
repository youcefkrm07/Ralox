"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import { Trash2, Plus } from "lucide-react"

interface DeleteOnExitEditorProps {
  settingKey: string
  category: string
}

export function DeleteOnExitEditor({ settingKey, category }: DeleteOnExitEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state
  const settings = jsonConfig[category] || {}

  const [isEnabled, setIsEnabled] = useState(settings[settingKey] === true)
  const [paths, setPaths] = useState<string[]>(settings.deleteFilesDirectoriesOnExit || [])
  const [secureDelete, setSecureDelete] = useState(settings.securelyDeleteFilesDirectoriesOnExit || false)

  useEffect(() => {
    // Update config when state changes
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: isEnabled },
    })

    if (isEnabled) {
      dispatch({
        type: "UPDATE_SETTING",
        payload: { category, key: "deleteFilesDirectoriesOnExit", value: paths },
      })
    }

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "securelyDeleteFilesDirectoriesOnExit", value: secureDelete },
    })
  }, [isEnabled, paths, secureDelete, category, settingKey, dispatch])

  const handleAddPath = () => {
    // Use native Android path picker if available
    if (typeof window !== "undefined" && (window as any).Android?.openPathPicker) {
      ;(window as any).currentPathPickerCallback = (selectedPath: string) => {
        if (selectedPath && !paths.includes(selectedPath)) {
          setPaths([...paths, selectedPath])
        }
        delete (window as any).currentPathPickerCallback
      }
      ;(window as any).Android.openPathPicker("window.currentPathPickerCallback")
    } else {
      // Fallback for browser
      const path = prompt("Enter the file or directory path:", "/storage/emulated/0/")
      if (path && !paths.includes(path)) {
        setPaths([...paths, path])
      }
    }
  }

  const handleRemovePath = (index: number) => {
    setPaths(paths.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Main toggle */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="delete-on-exit-enabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="delete-on-exit-enabled" className="font-medium text-gray-700">
          Enabled
        </label>
      </div>

      {isEnabled && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          {/* Path management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Files & directories</label>

            <div className="min-h-[60px] p-3 border border-gray-300 rounded-lg bg-gray-50">
              {paths.length === 0 ? (
                <p className="text-gray-500 text-sm">No paths selected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {paths.map((path, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {path}
                      <button onClick={() => handleRemovePath(index)} className="text-blue-600 hover:text-blue-800">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddPath}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Select Path
            </button>
          </div>

          {/* Secure delete option */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="secure-delete"
              checked={secureDelete}
              onChange={(e) => setSecureDelete(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="secure-delete" className="font-medium text-gray-700">
              Delete files securely
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
