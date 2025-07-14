"use client"

import { ConfigProvider } from "@/contexts/ConfigContext"
import { SearchProvider } from "@/contexts/SearchContext"
import { ConfigurationApp } from "@/components/ConfigurationApp"
import { FloatingEditorProvider } from "@/hooks/useFloatingEditor"

export default function Home() {
  return (
    <ConfigProvider>
      <SearchProvider>
        <FloatingEditorProvider>
          <div className="min-h-screen bg-white">
            <ConfigurationApp />
          </div>
        </FloatingEditorProvider>
      </SearchProvider>
    </ConfigProvider>
  )
}
