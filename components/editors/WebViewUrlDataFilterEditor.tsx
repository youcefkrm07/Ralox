"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import type { WebViewUrlFilter } from "@/types/config"
import { Plus, Trash2 } from "lucide-react"

interface WebViewUrlDataFilterEditorProps {
  settingKey: string
  category: string
}

export function WebViewUrlDataFilterEditor({ settingKey, category }: WebViewUrlDataFilterEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  const [filters, setFilters] = useState<WebViewUrlFilter[]>(() => {
    const existing = jsonConfig[category]?.[settingKey]
    if (Array.isArray(existing) && existing.length > 0) {
      return existing
    }
    return [
      {
        urlExpression: "",
        urlExpressionBlockOnMatch: false,
        urlReplacement: "",
        urlReplacementUrlEncode: false,
        dataExpression: "",
        dataExpressionIgnoreCase: false,
        dataExpressionBlockOnMatch: false,
        dataReplacement: "",
        dataReplacementReplaceAll: false,
      },
    ]
  })

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: filters },
    })
  }, [filters, category, settingKey, dispatch])

  const addFilter = () => {
    const newFilter: WebViewUrlFilter = {
      urlExpression: "",
      urlExpressionBlockOnMatch: false,
      urlReplacement: "",
      urlReplacementUrlEncode: false,
      dataExpression: "",
      dataExpressionIgnoreCase: false,
      dataExpressionBlockOnMatch: false,
      dataReplacement: "",
      dataReplacementReplaceAll: false,
    }
    setFilters([...filters, newFilter])
    setCurrentIndex(filters.length)
  }

  const removeFilter = () => {
    if (filters.length > 1) {
      const newFilters = filters.filter((_, index) => index !== currentIndex)
      setFilters(newFilters)
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const updateFilter = (field: keyof WebViewUrlFilter, value: any) => {
    const newFilters = [...filters]
    newFilters[currentIndex] = { ...newFilters[currentIndex], [field]: value }
    setFilters(newFilters)
  }

  const currentFilter = filters[currentIndex] || filters[0]

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {filters.map((_, index) => (
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
          <button onClick={addFilter} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={removeFilter}
            disabled={filters.length <= 1}
            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter content */}
      <div className="border border-gray-300 rounded-b-md rounded-tr-md p-4 space-y-6">
        {/* URL section */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">URL</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regular expression</label>
            <input
              type="text"
              value={currentFilter.urlExpression}
              onChange={(e) => updateFilter("urlExpression", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="url-block-on-match"
              checked={currentFilter.urlExpressionBlockOnMatch}
              onChange={(e) => updateFilter("urlExpressionBlockOnMatch", e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="url-block-on-match" className="text-sm text-gray-700">
              Block if matching
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replacement</label>
            <input
              type="text"
              value={currentFilter.urlReplacement}
              onChange={(e) => updateFilter("urlReplacement", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="url-encode-replacement"
              checked={currentFilter.urlReplacementUrlEncode}
              onChange={(e) => updateFilter("urlReplacementUrlEncode", e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="url-encode-replacement" className="text-sm text-gray-700">
              URL-encode replacement
            </label>
          </div>
        </div>

        {/* Data section */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">Data</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Regular expression</label>
            <input
              type="text"
              value={currentFilter.dataExpression}
              onChange={(e) => updateFilter("dataExpression", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="data-ignore-case"
              checked={currentFilter.dataExpressionIgnoreCase}
              onChange={(e) => updateFilter("dataExpressionIgnoreCase", e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="data-ignore-case" className="text-sm text-gray-700">
              Ignore case
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="data-block-on-match"
              checked={currentFilter.dataExpressionBlockOnMatch}
              onChange={(e) => updateFilter("dataExpressionBlockOnMatch", e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="data-block-on-match" className="text-sm text-gray-700">
              Block if matching
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replacement</label>
            <input
              type="text"
              value={currentFilter.dataReplacement}
              onChange={(e) => updateFilter("dataReplacement", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="data-replace-all"
              checked={currentFilter.dataReplacementReplaceAll}
              onChange={(e) => updateFilter("dataReplacementReplaceAll", e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="data-replace-all" className="text-sm text-gray-700">
              Replace all
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
