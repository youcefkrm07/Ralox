"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useSearch } from "@/contexts/SearchContext"
import { useConfig } from "@/contexts/ConfigContext"
import { SettingRow } from "./SettingRow"
import { formatLabel } from "@/utils/formatters"
import { NON_INTERACTIVE_DIRECTORY_KEYS } from "@/constants/config"

interface CategoryAccordionProps {
  category: string
  settings: Record<string, any>
}

export function CategoryAccordion({ category, settings }: CategoryAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { searchQuery } = useSearch()
  const { state } = useConfig()

  // Filter settings based on search query and visibility rules
  const visibleSettings = Object.entries(settings).filter(([key, value]) => {
    // Skip child keys, compound children, and non-interactive keys
    if (state.allChildKeys.has(key) || NON_INTERACTIVE_DIRECTORY_KEYS.includes(key)) {
      return false
    }

    // If there's a search query, filter by label
    if (searchQuery) {
      const label = formatLabel(key).toLowerCase()
      return label.includes(searchQuery.toLowerCase())
    }

    return true
  })

  // Don't render category if no visible settings
  if (visibleSettings.length === 0) {
    return null
  }

  // Auto-expand if searching and has matches
  const shouldExpand = isExpanded || (searchQuery && visibleSettings.length > 0)

  return (
    <div className="category mb-6 border border-gray-300 rounded-lg overflow-hidden">
      <div
        className="category-header bg-blue-600 text-white px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-blue-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">{formatLabel(category)}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${shouldExpand ? "rotate-180" : ""}`} />
      </div>

      {shouldExpand && (
        <div className="category-content p-2">
          {visibleSettings.map(([key, value]) => (
            <SettingRow key={key} settingKey={key} value={value} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}
