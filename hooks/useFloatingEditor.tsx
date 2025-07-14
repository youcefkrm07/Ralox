"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import { useConfig } from "@/contexts/ConfigContext"

interface FloatingEditorContextType {
  isOpen: boolean
  currentKey: string | null
  currentCategory: string | null
  openEditor: (key: string, category: string) => void
  closeEditor: () => void
  saveChanges: () => void
}

const FloatingEditorContext = createContext<FloatingEditorContextType | null>(null)

export function FloatingEditorProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const { dispatch } = useConfig()

  const openEditor = (key: string, category: string) => {
    setCurrentKey(key)
    setCurrentCategory(category)
    setIsOpen(true)
  }

  const closeEditor = () => {
    setIsOpen(false)
    setCurrentKey(null)
    setCurrentCategory(null)
  }

  const saveChanges = () => {
    // Save logic will be handled by individual editor components
    // through form submission or direct state updates
    closeEditor()
  }

  return (
    <FloatingEditorContext.Provider
      value={{
        isOpen,
        currentKey,
        currentCategory,
        openEditor,
        closeEditor,
        saveChanges,
      }}
    >
      {children}
    </FloatingEditorContext.Provider>
  )
}

export function useFloatingEditor() {
  const context = useContext(FloatingEditorContext)
  if (!context) {
    throw new Error("useFloatingEditor must be used within a FloatingEditorProvider")
  }
  return context
}
