"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import { formatLabel } from "@/utils/formatters"
import { generateRandomValue } from "@/utils/generators"
import { keysWithCustomOption } from "@/constants/config"

interface SimpleEditorProps {
  settingKey: string
  category: string
}

export function SimpleEditor({ settingKey, category }: SimpleEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig, originalJsonConfig } = state

  const currentValue = jsonConfig[category]?.[settingKey]
  const originalValue = originalJsonConfig[category]?.[settingKey]

  const [value, setValue] = useState(currentValue)
  const [customValue, setCustomValue] = useState("")
  const [isCustom, setIsCustom] = useState(false)

  useEffect(() => {
    setValue(currentValue)

    // Check if current value is custom
    if (Array.isArray(currentValue) && Array.isArray(originalValue) && keysWithCustomOption.includes(settingKey)) {
      const isCustomOption = currentValue.length > 0 && !originalValue.includes(currentValue[0])
      setIsCustom(isCustomOption)
      if (isCustomOption) {
        setCustomValue(currentValue[0])
      }
    }
  }, [currentValue, originalValue, settingKey])

  // helper to push any change to the global config
  const pushUpdate = (newVal: any) => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: newVal },
    })
  }

  const renderControl = () => {
    // Boolean control
    if (typeof currentValue === "boolean") {
      return (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id={settingKey}
            checked={value}
            onChange={(e) => {
              const newVal = e.target.checked
              setValue(newVal)
              pushUpdate(newVal)
            }}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor={settingKey} className="font-medium text-gray-700">
            {formatLabel(settingKey)}
          </label>
        </div>
      )
    }

    // Array with predefined options
    if (
      Array.isArray(originalValue) &&
      !settingKey.toLowerCase().includes("strings") &&
      !settingKey.toLowerCase().includes("filters")
    ) {
      return (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">{formatLabel(settingKey)}</label>
          <select
            value={isCustom ? "custom" : Array.isArray(value) ? value[0] : value}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setIsCustom(true)
              } else {
                setIsCustom(false)
                const newVal = [e.target.value]
                setValue(newVal)
                pushUpdate(newVal)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {originalValue.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {keysWithCustomOption.includes(settingKey) && <option value="custom">CUSTOM</option>}
          </select>

          {isCustom && keysWithCustomOption.includes(settingKey) && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value)
                  pushUpdate([e.target.value])
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter custom value"
              />
              <button
                type="button"
                onClick={() => {
                  const v = generateRandomValue(settingKey)
                  setCustomValue(v)
                  pushUpdate([v])
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate
              </button>
            </div>
          )}
        </div>
      )
    }

    // Array as textarea (for strings/filters)
    if (
      Array.isArray(value) &&
      (settingKey.toLowerCase().includes("strings") || settingKey.toLowerCase().includes("filters"))
    ) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{formatLabel(settingKey)}</label>
          <textarea
            value={Array.isArray(value) ? value.join("\n") : ""}
            onChange={(e) => {
              const newVal = e.target.value.split("\n").filter(Boolean)
              setValue(newVal)
              pushUpdate(newVal)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            rows={6}
            placeholder="Enter one item per line..."
          />
        </div>
      )
    }

    // Large text fields
    if (settingKey === "customBuildPropsFile" || settingKey.includes("RegularExpression")) {
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{formatLabel(settingKey)}</label>
          <textarea
            value={value || ""}
            onChange={(e) => {
              const newVal = e.target.value
              setValue(newVal)
              pushUpdate(newVal)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            rows={8}
          />
        </div>
      )
    }

    // Default text/number input
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{formatLabel(settingKey)}</label>
        <input
          type={
            typeof currentValue === "number" ? "number" : settingKey === "bundleAppDataPassword" ? "password" : "text"
          }
          value={value || ""}
          onChange={(e) => {
            const inputType = typeof currentValue === "number" ? "number" : "text"
            const newVal = inputType === "number" ? Number(e.target.value) : e.target.value
            setValue(newVal)
            pushUpdate(newVal)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          step={typeof currentValue === "number" ? "any" : undefined}
        />
      </div>
    )
  }

  return <div>{renderControl()}</div>
}
