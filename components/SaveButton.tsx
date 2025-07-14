"use client"

import { useState } from "react"
import { useConfig } from "@/contexts/ConfigContext"
import { getUpdatedConfig } from "@/utils/configProcessor"
import { Save } from "lucide-react"

export function SaveButton() {
  const { state } = useConfig()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    let packageName = state.currentPackageName

    if (!packageName) {
      packageName = prompt("📦 Package name not detected. Please enter it:") || ""
      if (!packageName) {
        alert("❌ Save cancelled: Package name required.")
        return
      }
    }

    try {
      setIsSaving(true)
      const finalConfig = getUpdatedConfig(state)
      const jsonString = JSON.stringify(finalConfig, null, 2).replace(/\\\\u/g, "\\u")

      // Try Android native save first
      if (typeof window !== "undefined" && (window as any).Android?.saveEncryptedConfig) {
        ;(window as any).Android.saveEncryptedConfig(jsonString, packageName, state.configFileSplitCount)
        if ((window as any).Android.showToast) {
          ;(window as any).Android.showToast("✅ Configuration saved successfully!")
        }
      } else {
        // Browser fallback - download as JSON
        console.warn("🌐 Browser mode: Downloading config as JSON file.")
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${packageName}_cloneSettings.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        alert("📥 Configuration downloaded as JSON file!")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert(`❌ Save Error: ${errorMessage}`)
      console.error("Save Error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-[1000]"
    >
      <Save className="w-5 h-5" />
      {isSaving ? "Saving..." : "Save Settings"}
    </button>
  )
}
