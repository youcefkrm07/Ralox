"use client"
import { useConfig } from "@/contexts/ConfigContext"
import { SimpleEditor } from "./SimpleEditor"

interface CompoundEditorProps {
  settingKey: string
  category: string
}

export function CompoundEditor({ settingKey, category }: CompoundEditorProps) {
  const { state } = useConfig()
  const { jsonConfig } = state

  // This would handle compound settings like dnsOverHttps
  // For now, we'll use the SimpleEditor as a fallback
  return <SimpleEditor settingKey={settingKey} category={category} />
}
