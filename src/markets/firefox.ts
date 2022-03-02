import { MozillaWebstoreClient, Options, errorMap } from "@plasmo-corp/mwu"

import { BrowserName, CommonOptions } from "~commons"
import { getVerboseError } from "~utils/error"
import { getCorrectZip, getManifestJson } from "~utils/file"
import {
  enableVerboseLogging,
  getVerboseLogger,
  logSuccessfullyPublished
} from "~utils/logging"
import { validateOptions } from "~utils/validator"

export type FirefoxOptions = Options & CommonOptions

const market = BrowserName.Firefox

const vLog = getVerboseLogger(market)

async function deploy({
  extId,
  apiKey,
  apiSecret,
  verbose,
  zip
}: FirefoxOptions) {
  const manifest = getManifestJson(zip)

  const id = manifest["browser_specific_settings"]?.["gecko"]?.["id"] || extId
  const client = new MozillaWebstoreClient({
    extId: id,
    apiKey,
    apiSecret
  })

  vLog(`Updating extension with ID ${id}`)

  try {
    await client.submit({
      filePath: zip,
      version: manifest.version
    })
    logSuccessfullyPublished({ extId: id, market, zip })

    return true
  } catch (error) {
    throw getVerboseError(error, market, `"${id}" (${manifest.name})`)
  }
}

export async function deployFirefox(options: FirefoxOptions): Promise<boolean> {
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
