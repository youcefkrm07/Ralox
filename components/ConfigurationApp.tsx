"use client"

import { useConfig } from "@/contexts/ConfigContext"
import { SearchBar } from "./SearchBar"
import { CategoryAccordion } from "./CategoryAccordion"
import { FloatingEditor } from "./FloatingEditor"
import { SaveButton } from "./SaveButton"
import { LoadingSpinner } from "./LoadingSpinner"
import { ErrorMessage } from "./ErrorMessage"

export function ConfigurationApp() {
  const { state } = useConfig()

  if (state.isLoading) {
    return <LoadingSpinner />
  }

  if (state.error) {
    return <ErrorMessage message={state.error} />
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <SearchBar />

      <div id="package-info" className="hidden">
        <p>
          <strong>📦 Package:</strong> <span id="packageNameDisplay">{state.currentPackageName || "Not detected"}</span>
        </p>
        <p>
          <strong>🔢 Split Count:</strong> <span id="splitCountDisplay">{state.configFileSplitCount}</span>
        </p>
      </div>

      <div id="config-container">
        {Object.entries(state.jsonConfig).map(([category, settings]) => (
          <CategoryAccordion key={category} category={category} settings={settings} />
        ))}
      </div>

      <SaveButton />
      <FloatingEditor />
    </div>
  )
}
