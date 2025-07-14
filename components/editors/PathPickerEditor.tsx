"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import { Plus, Trash2 } from "lucide-react"

interface PathPickerEditorProps {
  settingKey: string
  category: string
}

export function PathPickerEditor({ settingKey, category }: PathPickerEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  // Ensure the config value is an array
  const initialPaths: string[] = Array.isArray(jsonConfig[category]?.[settingKey])
    ? jsonConfig[category][settingKey]
    : []

  const [paths, setPaths] = useState<string[]>(initialPaths)

  // Sync local state with global config
  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: paths },
    })
  }, [paths, category, settingKey, dispatch])

  // -------- Helpers --------
  const handleAddPath = () => {
    // Prefer native Android picker
    if (typeof window !== "undefined" && (window as any).Android?.openPathPicker) {
      ;(window as any).currentPathPickerCallback = (selectedPath: string) => {
        if (selectedPath && !paths.includes(selectedPath)) {
          setPaths((prev) => [...prev, selectedPath])
        }
        delete (window as any).currentPathPickerCallback
      }
      ;(window as any).Android.openPathPicker("window.currentPathPickerCallback")
    } else {
      // Fallback – prompt in browser preview
      const path = prompt("Enter the file or directory path:", "/storage/emulated/0/")
      if (path && !paths.includes(path)) {
        setPaths((prev) => [...prev, path])
      }
    }
  }

  const handleRemovePath = (index: number) => {
    setPaths((prev) => prev.filter((_, i) => i !== index))
  }

  // -------- Render --------
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {settingKey === "bundleFilesDirectories" ? "Bundle directories/files" : "Bundle internal directories/files"}
        </label>

        <div className="min-h-[60px] p-3 border border-gray-300 rounded-lg bg-gray-50">
          {paths.length === 0 ? (
            <p className="text-gray-500 text-sm">No paths selected</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {paths.map((p, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {p}
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
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Select Path
        </button>
      </div>
    </div>
  )
}
