"use client"

import { useFloatingEditor } from "@/hooks/useFloatingEditor"
import { formatLabel } from "@/utils/formatters"
import { EditorContent } from "./editors/EditorContent"
import { X } from "lucide-react"
import React from "react"

export function FloatingEditor() {
  const { isOpen, currentKey, currentCategory, closeEditor, saveChanges } = useFloatingEditor()

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeEditor()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeEditor()
    }
  }

  // Add escape key listener
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isOpen || !currentKey || !currentCategory) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-[90%] max-w-2xl max-h-[85vh] flex flex-col transition-transform duration-200 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">{formatLabel(currentKey)}</h2>
          <button onClick={closeEditor} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <EditorContent settingKey={currentKey} category={currentCategory} />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={closeEditor}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveChanges}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
