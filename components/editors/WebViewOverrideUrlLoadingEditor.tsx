"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import type { WebViewOverrideUrlLoading } from "@/types/config"
import { Plus, Trash2 } from "lucide-react"

interface WebViewOverrideUrlLoadingEditorProps {
  settingKey: string
  category: string
}

export function WebViewOverrideUrlLoadingEditor({ settingKey, category }: WebViewOverrideUrlLoadingEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  const [items, setItems] = useState<WebViewOverrideUrlLoading[]>(() => {
    const existing = jsonConfig[category]?.[settingKey]
    if (Array.isArray(existing) && existing.length > 0) {
      return existing
    }
    return [{ urlExpression: "", overrideUrlLoading: true }]
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: items },
    })
  }, [items, category, settingKey, dispatch])

  const addItem = () => {
    const newItem: WebViewOverrideUrlLoading = { urlExpression: "", overrideUrlLoading: true }
    setItems([...items, newItem])
    setCurrentIndex(items.length)
  }

  const removeItem = () => {
    if (items.length > 1) {
      const newItems = items.filter((_, index) => index !== currentIndex)
      setItems(newItems)
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const updateItem = (field: keyof WebViewOverrideUrlLoading, value: any) => {
    const newItems = [...items]
    newItems[currentIndex] = { ...newItems[currentIndex], [field]: value }
    setItems(newItems)
  }

  const currentItem = items[currentIndex] || items[0]

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {items.map((_, index) => (
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
          <button onClick={addItem} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={removeItem}
            disabled={items.length <= 1}
            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item content */}
      <div className="border border-gray-300 rounded-b-md rounded-tr-md p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Regular expression</label>
          <input
            type="text"
            value={currentItem.urlExpression}
            onChange={(e) => updateItem("urlExpression", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Override URL loading</label>
          <div className="space-y-2">
            {[
              { label: "Disabled", value: false },
              { label: "Enabled", value: true },
            ].map((option) => (
              <div key={option.label} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`override-${currentIndex}-${option.label}`}
                  name={`override-${currentIndex}`}
                  checked={currentItem.overrideUrlLoading === option.value}
                  onChange={() => updateItem("overrideUrlLoading", option.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`override-${currentIndex}-${option.label}`} className="text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
