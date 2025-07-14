"use client"

import { useState, useEffect } from "react"
import { useConfig } from "@/contexts/ConfigContext"

interface HostsBlockerEditorProps {
  settingKey: string
  category: string
}

export function HostsBlockerEditor({ settingKey, category }: HostsBlockerEditorProps) {
  const { state, dispatch } = useConfig()
  const { jsonConfig } = state
  const settings = jsonConfig[category] || {}

  const [isEnabled, setIsEnabled] = useState(settings[settingKey] === true)
  const [blockByDefault, setBlockByDefault] = useState(settings.hostsBlockerBlockByDefault === true)
  const [showNotification, setShowNotification] = useState(settings.hostsBlockerShowNotification === true)
  const [useFile, setUseFile] = useState(settings.hostsBlockerUseFile === true)
  const [fileContent, setFileContent] = useState(settings.hostsBlockerFileContent || "")
  const [allowAllOtherHosts, setAllowAllOtherHosts] = useState(settings.hostsBlockerAllowAllOtherHosts === true)

  useEffect(() => {
    // Update config when state changes
    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: settingKey, value: isEnabled },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "hostsBlockerBlockByDefault", value: blockByDefault },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "hostsBlockerShowNotification", value: showNotification },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "hostsBlockerUseFile", value: useFile },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "hostsBlockerFileContent", value: fileContent },
    })

    dispatch({
      type: "UPDATE_SETTING",
      payload: { category, key: "hostsBlockerAllowAllOtherHosts", value: allowAllOtherHosts },
    })
  }, [
    isEnabled,
    blockByDefault,
    showNotification,
    useFile,
    fileContent,
    allowAllOtherHosts,
    category,
    settingKey,
    dispatch,
  ])

  const handleLoadFile = () => {
    if (typeof window !== "undefined" && (window as any).Android?.openFilePicker) {
      ;(window as any).hostsFileCallback = (content: string) => {
        if (typeof content === "string") {
          setFileContent(content)
        }
        delete (window as any).hostsFileCallback
      }
      ;(window as any).Android.openFilePicker("window.hostsFileCallback")
    } else {
      const content = prompt("Paste hosts file content:", fileContent)
      if (content !== null) {
        setFileContent(content)
      }
    }
  }

  const getFileStatus = () => {
    if (fileContent) {
      const lineCount = fileContent.split("\n").filter(Boolean).length
      return `✅ ${lineCount} line(s) loaded.`
    }
    return "No file loaded."
  }

  return (
    <div className="space-y-6">
      {/* Main toggle */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="hosts-blocker-enabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="hosts-blocker-enabled" className="font-medium text-gray-700">
          Enabled
        </label>
      </div>

      {isEnabled && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200">
          <p className="text-sm text-gray-600">
            For each host that is accessed by the clone a notification is shown. Select Allow to permanently allow the
            host, Block to permanently block the host or Ignore to ask again when the app is started the next time.
          </p>

          {/* Basic options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="block-by-default"
                checked={blockByDefault}
                onChange={(e) => setBlockByDefault(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="block-by-default" className="text-sm text-gray-700">
                Block by default
              </label>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="show-notification"
                checked={showNotification}
                onChange={(e) => setShowNotification(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show-notification" className="text-sm text-gray-700">
                Show notification
              </label>
            </div>
          </div>

          {/* Hosts file section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="use-hosts-file"
                checked={useFile}
                onChange={(e) => setUseFile(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="use-hosts-file" className="text-sm text-gray-700">
                Hosts file
              </label>
            </div>

            {useFile && (
              <div className="pl-4 space-y-3">
                <p className="text-sm text-gray-600">
                  You may load a text file to automatically block listed hosts. The format must be 127.0.0.1
                  &lt;host&gt; per line. You can also use the default AdAway hosts file: https://adaway.org/hosts.txt
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleLoadFile}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Load hosts file
                  </button>

                  <button
                    type="button"
                    onClick={() => setFileContent("")}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Clear hosts file
                  </button>

                  <div className="text-sm text-blue-600 font-medium">{getFileStatus()}</div>
                </div>
              </div>
            )}
          </div>

          {/* Allow all other hosts */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="allow-all-other"
                checked={allowAllOtherHosts}
                onChange={(e) => setAllowAllOtherHosts(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="allow-all-other" className="text-sm text-gray-700">
                Allow all other hosts
              </label>
            </div>

            <p className="text-sm text-gray-600">
              To create a white-list file, write the host lines as # x.x.x.x &lt;host&gt; and enable Block by default.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
