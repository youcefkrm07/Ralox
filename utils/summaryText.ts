import { CUSTOM_EDITORS, keysWithCustomOption } from "@/constants/config"

export function getSummaryText(key: string, value: any, category: string): string {
  // Handle deleteOnExit specially
  if (key === "deleteOnExit") {
    // This would need access to the config context, so we'll handle it in the component
    return value ? "Enabled" : "Disabled"
  }

  // Handle custom editors
  if (CUSTOM_EDITORS.includes(key)) {
    if (key === "hostsBlocker" || key === "bundleAppData") {
      return value ? "Enabled" : "Disabled"
    }
    if (key === "spoofGpsTrack") {
      // Assuming 'value' here is the boolean spoofGpsTrack
      if (value) {
        // If enabled, try to show selected track name
        const tracks = (window as any)?.configState?.jsonConfig?.[category]?.spoofGpsTracks || []
        const index = (window as any)?.configState?.jsonConfig?.[category]?.spoofGpsTrackIndex || 0
        if (tracks[index]?.trackName) {
          return `Track: ${tracks[index].trackName}`
        }
        return "Enabled"
      }
      return "Disabled"
    }
    const count = Array.isArray(value) ? value.length : 0
    return `${count} item(s)`
  }

  // Handle object parents
  const isObjectParent = typeof value === "object" && value !== null && !Array.isArray(value)
  if (isObjectParent) {
    return value.enabled ? "Enabled" : "Disabled"
  }

  // Handle boolean values
  if (typeof value === "boolean") {
    return value ? "Enabled" : "Disabled"
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) return "[0 items]"

    // Check if it's a custom value
    if (keysWithCustomOption.includes(key)) {
      // This would need access to original config, simplified for now
      return typeof value[0] === "string" ? value[0] : "Custom"
    }

    if (typeof value[0] === "string") return value[0]
    return `[${value.length} items]`
  }

  // Handle long strings
  if (typeof value === "string" && value.length > 20) {
    return value.substring(0, 17) + "..."
  }

  return value || "Not set"
}
