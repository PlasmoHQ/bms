import { BrowserName, marketNameMap } from "~commons"

import { getManifestJson } from "./file"

export function logSuccessfullyPublished({
  extId = null as string | number,
  market = "" as BrowserName,
  zip = ""
}) {
  const { name: extName, version: extVersion } = getManifestJson(zip)
  const storeName = marketNameMap[market] || market
  console.log(
    `Successfully updated "${extId}" (${extName}) to version ${extVersion} on ${storeName}!`
  )
}

const verboseStepMap = {} as Record<BrowserName, number>

export function getVerboseMessage({
  message = "Message",
  prefix = "",
  market = "" as BrowserName
}): string {
  verboseStepMap[market] = 1 + (verboseStepMap?.[market] ?? 0)
  let msg = `${market}: Step ${verboseStepMap[market]}) ${message}`
  if (prefix !== "Error") {
    prefix = prefix || "Info"
    msg = `${prefix} ${msg}`
  }
  if (prefix === "Info") {
    msg = msg.trim()
  } else if (prefix === "Error") {
    msg = msg.trimStart()
  }
  return msg
}

const verboseLogMap = {} as Record<BrowserName, boolean>

export const enableVerboseLogging = (market: BrowserName) => {
  verboseLogMap[market] = true
  process.env.VERBOSE = "true"
}

export function getVerboseLogger(market = "" as BrowserName) {
  return (message: string) =>
    verboseLogMap[market] &&
    console.log(
      getVerboseMessage({
        market,
        message
      })
    )
}
