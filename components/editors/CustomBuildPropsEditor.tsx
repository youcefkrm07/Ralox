"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import type { CustomBuildProp } from "@/types/config"
import { Plus, Trash2 } from "lucide-react"

interface CustomBuildPropsEditorProps {
  settingKey: string
  category: string
}

export function CustomBuildPropsEditor({ settingKey, category }: CustomBuildPropsEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  const [props, setProps] = useState<CustomBuildProp[]>(() => {
    const existing = jsonConfig[category]?.[settingKey]
    if (Array.isArray(existing) && existing.length > 0) {
      return existing
    }
    return [{ name: "", value: "" }]
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: props },
    })
  }, [props, category, settingKey, dispatch])

  const addProp = () => {
    const newProp: CustomBuildProp = { name: "", value: "" }
    setProps([...props, newProp])
    setCurrentIndex(props.length)
  }

  const removeProp = () => {
    if (props.length > 1) {
      const newProps = props.filter((_, index) => index !== currentIndex)
      setProps(newProps)
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const updateProp = (field: keyof CustomBuildProp, value: string) => {
    const newProps = [...props]
    newProps[currentIndex] = { ...newProps[currentIndex], [field]: value }
    setProps(newProps)
  }

  const currentProp = props[currentIndex] || props[0]

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {props.map((_, index) => (
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
          <button onClick={addProp} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={removeProp}
            disabled={props.length <= 1}
            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Property content */}
      <div className="border border-gray-300 rounded-b-md rounded-tr-md p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={currentProp.name}
            onChange={(e) => updateProp("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., ro.build.version.release"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input
            type="text"
            value={currentProp.value}
            onChange={(e) => updateProp("value", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 14"
          />
        </div>
      </div>
    </div>
  )
}
