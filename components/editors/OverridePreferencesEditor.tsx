"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import type { SharedPreference } from "@/types/config"
import { Plus, Trash2 } from "lucide-react"

interface OverridePreferencesEditorProps {
  settingKey: string
  category: string
}

export function OverridePreferencesEditor({ settingKey, category }: OverridePreferencesEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  const [preferences, setPreferences] = useState<SharedPreference[]>(() => {
    const existing = jsonConfig[category]?.[settingKey]
    if (Array.isArray(existing) && existing.length > 0) {
      return existing
    }
    return [{ name: "", nameRegExp: false, value: "" }]
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [enablePlaceholders, setEnablePlaceholders] = useState(
    jsonConfig[category]?.overrideSharedPreferencesEnablePlaceholders || false,
  )

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: preferences },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "overrideSharedPreferencesEnablePlaceholders", value: enablePlaceholders },
    })
  }, [preferences, enablePlaceholders, category, settingKey, dispatch])

  const addPreference = () => {
    const newPref: SharedPreference = { name: "", nameRegExp: false, value: "" }
    setPreferences([...preferences, newPref])
    setCurrentIndex(preferences.length)
  }

  const removePreference = () => {
    if (preferences.length > 1) {
      const newPrefs = preferences.filter((_, index) => index !== currentIndex)
      setPreferences(newPrefs)
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const updatePreference = (field: keyof SharedPreference, value: any) => {
    const newPrefs = [...preferences]
    newPrefs[currentIndex] = { ...newPrefs[currentIndex], [field]: value }
    setPreferences(newPrefs)
  }

  const currentPref = preferences[currentIndex] || preferences[0]

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {preferences.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`px-3 py-1 text-sm border border-gray-300 rounded-t-md ${
                index === currentIndex
                  ? "bg-white border-b-white font-medium text-blue-600"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <button onClick={addPreference} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={removePreference}
            disabled={preferences.length <= 1}
            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preference content */}
      <div className="border border-gray-300 rounded-b-md rounded-tr-md p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={currentPref.name}
            onChange={(e) => updatePreference("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="name-regexp"
            checked={currentPref.nameRegExp}
            onChange={(e) => updatePreference("nameRegExp", e.target.checked)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="name-regexp" className="text-sm text-gray-700">
            Regular expression
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input
            type="text"
            value={currentPref.value}
            onChange={(e) => updatePreference("value", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Enable placeholders option */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="enable-placeholders"
          checked={enablePlaceholders}
          onChange={(e) => setEnablePlaceholders(e.target.checked)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="enable-placeholders" className="text-sm text-gray-700">
          Enable placeholders in values
        </label>
      </div>
    </div>
  )
}
