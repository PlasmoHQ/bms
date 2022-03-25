import {
  ChromeWebstoreClient,
  Options,
  PublishTarget,
  errorMap
} from "@plasmo-corp/cwu"

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

async function deploy({
  extId,
  clientId,
  refreshToken,
  target = "default",
  zip,
  dryRun
}: ChromeOptions) {
  const client = new ChromeWebstoreClient({
    extId,
    clientId,
    refreshToken
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

export async function deployChrome(options: ChromeOptions): Promise<boolean> {
  options.zip = getCorrectZip(options)

  if (options.verbose) {
    enableVerboseLogging(market)
  }

  validateOptions({
    market,
    options,
    errorMap
  })

  return deploy(options)
}
