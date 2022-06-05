import {
  SafariPublisher,
  Options,
  errorMap
} from "@plasmohq/safari-publisher"

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

export type SafariOptions = Options & CommonOptions

const market = BrowserName.Safari

const vLog = getVerboseLogger(market)

async function submit({
  zip,
  dryRun,
  bundleId,
  ...options
}: SafariOptions) {
  const client = new SafariPublisher({
    bundleId,
    ...options
  })

  vLog(`Updating extension with ID ${bundleId}`)

  if (dryRun) {
    return true
  }

  try {
    await client.submit({
      filePath: zip
    })
    logSuccessfullyPublished({ extId: bundleId, market, zip })

    return true
  } catch (error) {
    const manifest = getManifestJson(zip)
    throw getVerboseError(error, market, `"${bundleId}" (${manifest.name})`)
  }
}

export async function submitSafari(options: SafariOptions): Promise<boolean> {
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
