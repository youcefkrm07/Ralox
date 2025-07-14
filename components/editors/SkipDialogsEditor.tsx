"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"

interface SkipDialogsEditorProps {
  settingKey: string
  category: string
}

export function SkipDialogsEditor({ settingKey, category }: SkipDialogsEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state
  const settings = jsonConfig[category] || {}

  const [dialogStrings, setDialogStrings] = useState<string[]>(settings.skipDialogsStrings || [])
  const [stacktraceStrings, setStacktraceStrings] = useState<string[]>(settings.skipDialogsStacktraceStrings || [])
  const [monitorStacktraces, setMonitorStacktraces] = useState(settings.skipDialogsMonitorStacktraces || false)

  useEffect(() => {
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "skipDialogsStrings", value: dialogStrings },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "skipDialogsStacktraceStrings", value: stacktraceStrings },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "skipDialogsMonitorStacktraces", value: monitorStacktraces },
    })
  }, [dialogStrings, stacktraceStrings, monitorStacktraces, category, dispatch])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Don't show dialogs if they contain one of these strings
        </label>
        <textarea
          value={dialogStrings.join("\n")}
          onChange={(e) => setDialogStrings(e.target.value.split("\n").filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          rows={6}
          placeholder="Enter a string"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Don't show dialogs if their call stack contains one of these strings
        </label>
        <textarea
          value={stacktraceStrings.join("\n")}
          onChange={(e) => setStacktraceStrings(e.target.value.split("\n").filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          rows={6}
          placeholder="Enter a string"
        />
      </div>

      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="monitor-stacktraces"
          checked={monitorStacktraces}
          onChange={(e) => setMonitorStacktraces(e.target.checked)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="monitor-stacktraces" className="text-sm text-gray-700">
          Monitor dialog call stacks
        </label>
      </div>
    </div>
  )
}
