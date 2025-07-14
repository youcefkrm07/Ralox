export function generateRandomValue(key: string): string {
  const generateDigits = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("")

  const generateHex = (len: number) =>
    Array.from({ length: len }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")

  const generateAlphanum = (len: number) =>
    Array.from({ length: len }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("")

  const generateUuidV4 = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

  const generateRealisticMacAddress = () => {
    const ouiList = ["00:05:69", "00:1A:11", "00:E0:4C", "3C:5A:B4", "40:B8:9A", "BC:F5:AC", "D8:80:39"]
    const oui = ouiList[Math.floor(Math.random() * ouiList.length)]
    const host = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0"),
    ).join(":")
    return `${oui}:${host}`.toUpperCase()
  }

  const generateLuhnCheckedImei = () => {
    const imeiBase = generateDigits(14)
    let sum = 0
    for (let i = 0; i < imeiBase.length; i++) {
      let digit = Number.parseInt(imeiBase[i])
      if (i % 2 !== 0) {
        digit *= 2
        if (digit > 9) {
          digit = (digit % 10) + 1
        }
      }
      sum += digit
    }
    const checkDigit = (10 - (sum % 10)) % 10
    return imeiBase + checkDigit
  }

  const generateRealisticImsi = () => {
    const mccMncPairs = [
      { mcc: "310", mnc: "260" }, // T-Mobile US
      { mcc: "310", mnc: "410" }, // AT&T US
      { mcc: "234", mnc: "15" }, // Vodafone UK
      { mcc: "262", mnc: "01" }, // T-Mobile DE
      { mcc: "404", mnc: "45" }, // Airtel IN
    ]
    const pair = mccMncPairs[Math.floor(Math.random() * mccMncPairs.length)]
    const msinLength = 15 - pair.mcc.length - pair.mnc.length
    const msin = generateDigits(msinLength)
    return pair.mcc + pair.mnc + msin
  }

  const generateAndroidSerial = () => {
    return Math.random() > 0.5 ? generateAlphanum(12) : generateHex(16)
  }

  const generators: Record<string, () => string> = {
    changeAndroidId: () => generateHex(16),
    changeImei: generateLuhnCheckedImei,
    changeImsi: generateRealisticImsi,
    changeAndroidSerial: generateAndroidSerial,
    changeWifiMacAddress: generateRealisticMacAddress,
    changeBluetoothMacAddress: generateRealisticMacAddress,
    changeEthernetMacAddress: generateRealisticMacAddress,
    changeGoogleAdvertisingId: generateUuidV4,
    changeFacebookAttributionId: generateUuidV4,
    changeAppSetId: generateUuidV4,
    changeOpenId: generateUuidV4,
    changeAmazonAdvertisingId: generateUuidV4,
    changeHuaweiAdvertisingId: generateUuidV4,
    changeGoogleServiceFrameworkId: () => generateHex(16),
  }

  return generators[key] ? generators[key]() : `CUSTOM_${Date.now()}`
}

export function generateRealisticCoordinates() {
  const r = (min: number, max: number) => Math.random() * (max - min) + min

  const landmasses = [
    { name: "America", lat: { min: -56, max: 72 }, lon: { min: -168, max: -34 } },
    { name: "Europe", lat: { min: 36, max: 71 }, lon: { min: -25, max: 45 } },
    { name: "Asia", lat: { min: -11, max: 82 }, lon: { min: 25, max: 180 } },
    { name: "Australia", lat: { min: -44, max: -10 }, lon: { min: 112, max: 154 } },
  ]

  const area = landmasses[Math.floor(Math.random() * landmasses.length)]
  const latitude = r(area.lat.min, area.lat.max).toFixed(6)
  const longitude = r(area.lon.min, area.lon.max).toFixed(6)

  return { latitude, longitude }
}
