import { MozillaWebstoreClient, Options, errorMap } from "@plasmo-corp/mwu"

import { BrowserName, CommonOptions } from "~commons"
import { getCorrectZip, getManifestJson } from "~utils/file"
import { getVerboseMessage, logSuccessfullyPublished } from "~utils/logging"
import { validateOptions } from "~utils/validator"

export type FirefoxOptions = Options & CommonOptions

const market = BrowserName.Firefox

async function deploy({
  extId,
  apiKey,
  apiSecret,
  verbose,
  zip
}: FirefoxOptions) {
  const client = new MozillaWebstoreClient({
    extId,
    apiKey,
    apiSecret
  })

  if (verbose) {
    console.log(
      getVerboseMessage({
        market,
        message: `Updating extension with ID ${extId}`
      })
    )
  }

  const manifest = getManifestJson(zip)

  try {
    await client.submit({
      filePath: zip,
      version: manifest.version
    })
  } catch (error) {
    throw new Error(
      getVerboseMessage({
        market,
        message: `Item "${extId}" (${manifest.name}): ${error.message}`,
        prefix: "Error"
      })
    )
  }

  logSuccessfullyPublished({ extId, market, zip })

  return true
}

export async function deployFirefox(options: FirefoxOptions): Promise<boolean> {
  options.zip = getCorrectZip(options)

  validateOptions({
    market: BrowserName.Firefox,
    options,
    errorMap
  })

  return deploy(options)
}
