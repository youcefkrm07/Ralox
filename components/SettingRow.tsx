"use client"

import { useFloatingEditor } from "@/hooks/useFloatingEditor"
import { formatLabel } from "@/utils/formatters"
import { getSummaryText } from "@/utils/summaryText"

interface SettingRowProps {
  settingKey: string
  value: any
  category: string
}

export function SettingRow({ settingKey, value, category }: SettingRowProps) {
  const { openEditor } = useFloatingEditor()

  const handleClick = () => {
    openEditor(settingKey, category)
  }

  return (
    <div
      className="setting-row flex justify-between items-center px-3 py-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleClick}
    >
      <div className="setting-row-label font-medium text-gray-800">{formatLabel(settingKey)}</div>
      <div className="setting-row-value text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
        {getSummaryText(settingKey, value, category)}
      </div>
    </div>
  )
}
