"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import type { WebViewCookie } from "@/types/config"
import { Plus, Trash2 } from "lucide-react"

interface WebViewCookieEditorProps {
  settingKey: string
  category: string
}

export function WebViewCookieEditor({ settingKey, category }: WebViewCookieEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state

  const currentValue = jsonConfig[category]?.[settingKey]
  const isEnabled = Array.isArray(currentValue)

  const [enabled, setEnabled] = useState(isEnabled)
  const [cookies, setCookies] = useState<WebViewCookie[]>(() => {
    if (Array.isArray(currentValue) && currentValue.length > 0) {
      return currentValue
    }
    return [{ name: "", path: "/", url: "", value: "" }]
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [removeAllCookies, setRemoveAllCookies] = useState(jsonConfig[category]?.removeAllCookies || false)

  useEffect(() => {
    if (enabled) {
      dispatch({
        type: "UPDATE_SETTING",
        payload: { category, key: settingKey, value: cookies },
      })
    } else {
      dispatch({
        type: "UPDATE_SETTING",
        payload: { category, key: settingKey, value: false },
      })
    }

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "removeAllCookies", value: removeAllCookies },
    })
  }, [enabled, cookies, removeAllCookies, category, settingKey, dispatch])

  const addCookie = () => {
    const newCookie: WebViewCookie = { name: "", path: "/", url: "", value: "" }
    setCookies([...cookies, newCookie])
    setCurrentIndex(cookies.length)
  }

  const removeCookie = () => {
    if (cookies.length > 1) {
      const newCookies = cookies.filter((_, index) => index !== currentIndex)
      setCookies(newCookies)
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const updateCookie = (field: keyof WebViewCookie, value: string) => {
    const newCookies = [...cookies]
    newCookies[currentIndex] = { ...newCookies[currentIndex], [field]: value }
    setCookies(newCookies)
  }

  const currentCookie = cookies[currentIndex] || cookies[0]

  return (
    <div className="space-y-6">
      {/* Main toggle */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="webview-cookies-enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="webview-cookies-enabled" className="font-medium text-gray-700">
          Enabled
        </label>
      </div>

      {enabled && (
        <div className="space-y-6 pl-4 border-l-2 border-gray-200">
          {/* Tab navigation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {cookies.map((_, index) => (
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
              <button onClick={addCookie} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={removeCookie}
                disabled={cookies.length <= 1}
                className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cookie content */}
          <div className="border border-gray-300 rounded-b-md rounded-tr-md p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                value={currentCookie.url}
                onChange={(e) => updateCookie("url", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={currentCookie.name}
                onChange={(e) => updateCookie("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="cookie_name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="text"
                value={currentCookie.value}
                onChange={(e) => updateCookie("value", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="cookie_value"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
              <input
                type="text"
                value={currentCookie.path}
                onChange={(e) => updateCookie("path", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/"
              />
            </div>
          </div>

          {/* Remove all cookies option */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="remove-all-cookies"
              checked={removeAllCookies}
              onChange={(e) => setRemoveAllCookies(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remove-all-cookies" className="text-sm text-gray-700">
              Remove all cookies
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
