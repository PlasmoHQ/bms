import {
  ChromeWebstoreAPI,
  Options,
  PublishTarget,
  errorMap
} from "@plasmohq/chrome-webstore-api"

import type { CommonOptions } from "~commons"
import { BrowserName } from "~commons"
import { getVerboseError } from "~utils/error"
import { getCorrectZip, getManifestJson } from "~utils/file"
import {
  enableVerboseLogging,
  getVerboseLogger,
  logSuccessfullyPublished
} from "~utils/logging"
import { validateOptions } from "~utils/validator"

export type ChromeOptions = {
  target?: PublishTarget
} & Options &
  CommonOptions

const market = BrowserName.Chrome

const vLog = getVerboseLogger(market)

async function submit({
  extId,
  target = "default",
  zip,
  dryRun,
  ...opts
}: ChromeOptions) {
  const client = new ChromeWebstoreAPI({
    extId,
    ...opts
  })

  vLog(`Updating extension with ID ${extId}`)

  if (dryRun) {
    return true
  }

  try {
    await client.submit({
      filePath: zip,
      target
    })

    logSuccessfullyPublished({ extId, market, zip })

    return true
  } catch (error) {
    const manifest = getManifestJson(zip)
    throw getVerboseError(error, market, `"${extId}" (${manifest.name})`)
  }
}

export async function submitChrome(options: ChromeOptions): Promise<boolean> {
  options.zip = getCorrectZip(options)

  if (options.verbose) {
    enableVerboseLogging(market)
  }

  validateOptions({
    market,
    options,
    errorMap
  })

  return submit(options)
}
