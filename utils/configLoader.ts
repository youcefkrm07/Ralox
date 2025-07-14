import type { JsonConfig, ParsedDevice, DeviceProfile } from "@/types/config"

const BIN_ID = "67fe9e1f8960c979a585d694"
const API_KEY = "$2a$10$SgT4qoOKXP6CD4u1jPEpduwi.2NbrCqV2u71AaL7mGaW.77CmNU7u"
const DEVICE_PROFILES_URL = "?action=get_devices"

const DEVICES_CSV_DATA = `Google,google,Pixel 8 Pro,husky,34;35
Google,google,Pixel 7a,lynx,33;34
Samsung,samsung,Galaxy S24 Ultra,e3q,34
Samsung,samsung,Galaxy A54 5G,a54x,33;34
OnePlus,OnePlus,OnePlus 12,OP5929L1,34
OnePlus,OnePlus,OnePlus Nord 3 5G,OP556FL1,33;34
Xiaomi,Xiaomi,Xiaomi 14 Ultra,aurora,34
Redmi,Redmi,Redmi Note 13 Pro 5G,garnet,33;34
Asus,asus,ROG Phone 7 series,ASUS_AI2205,34
Asus,asus,Zenfone 10,ASUS_AI2302,34`

function parseDeviceData(): ParsedDevice[] {
  return DEVICES_CSV_DATA.trim()
    .split("\n")
    .map((line) => {
      const parts = line.split(",")
      if (parts.length < 5) return null
      return {
        manufacturer: parts[0].trim(),
        brand: parts[1].trim(),
        model: parts[2].trim(),
        device: parts[3].trim(),
        sdks: parts[4]
          .split(";")
          .map((s) => Number.parseInt(s.trim(), 10))
          .filter((num) => !isNaN(num)),
      }
    })
    .filter(Boolean) as ParsedDevice[]
}

async function fetchDeviceProfiles(): Promise<DeviceProfile[]> {
  try {
    const response = await fetch(DEVICE_PROFILES_URL)
    if (!response.ok) {
      console.error("Failed to fetch device profiles via proxy.", await response.text())
      return []
    }
    const text = await response.text()

    const propMapping: Record<string, string> = {
      "ro.product.name": "buildPropsDeviceName",
      "ro.product.manufacturer": "buildPropsManufacturer",
      "ro.product.brand": "buildPropsBrand",
      "ro.product.model": "buildPropsModel",
      "ro.build.product": "buildPropsProduct",
      "ro.build.device": "buildPropsDevice",
      "ro.product.board": "buildPropsBoard",
      "ro.boot.radio": "buildPropsRadio",
      "ro.hardware": "buildPropsHardware",
    }

    const profilesText = text.split(/#\s*#+/).filter((p) => p.trim() !== "")

    return profilesText.map((profileText) => {
      const lines = profileText.trim().split("\n")
      const displayNameLine = lines.find((l) => l.startsWith("# ") && !l.startsWith("##"))
      const displayName = displayNameLine ? displayNameLine.replace("# ", "").trim() : "Unnamed Profile"

      const props: Record<string, string> = {}
      lines.forEach((line) => {
        if (line.startsWith("ro.")) {
          const parts = line.split("=", 2)
          if (parts.length === 2) {
            const key = parts[0].trim()
            const value = parts[1].trim()
            const mappedKey = propMapping[key]
            if (mappedKey) {
              props[mappedKey] = value
            }
          }
        }
      })
      return { displayName, props }
    })
  } catch (error) {
    console.error("Error fetching or parsing device profiles:", error)
    return []
  }
}

export async function loadConfiguration() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY },
    })

    if (!response.ok) {
      throw new Error(`Failed to load configuration (Status: ${response.status})`)
    }

    const data = await response.json()
    const jsonConfig: JsonConfig = data.record
    const originalJsonConfig: JsonConfig = JSON.parse(JSON.stringify(jsonConfig))

    const parsedDevices = parseDeviceData()
    const deviceProfiles = await fetchDeviceProfiles()

    return {
      jsonConfig,
      originalJsonConfig,
      parsedDevices,
      deviceProfiles,
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to load configuration")
  }
}
