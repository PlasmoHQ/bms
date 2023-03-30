import {
  MozillaAddonsAPI,
  type Options,
  errorMap
} from "@plasmohq/mozilla-addons-api"

import { BrowserName, type CommonOptions } from "~commons"
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

async function submit({ extId, zip, dryRun, ...opts }: FirefoxOptions) {
  const manifest = getManifestJson(zip)

  const id =
    manifest["browser_specific_settings"]?.["gecko"]?.["id"] ||
    manifest["applications"]?.["gecko"]?.["id"] ||
    extId

  const client = new MozillaAddonsAPI({
    extId: id,
    ...opts
  })

  vLog(`Updating extension with ID ${id}`)
  if (dryRun) {
    return true
  }

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

export async function submitFirefox(options: FirefoxOptions): Promise<boolean> {
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
