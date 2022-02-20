import {
  ChromeWebstoreClient,
  Options,
  PublishTarget,
  errorMap
} from "@plasmo-corp/cwu"

import type { CommonOptions } from "~commons"
import { BrowserName } from "~commons"
import { getCorrectZip, getManifestJson } from "~utils/file"
import { getVerboseMessage, logSuccessfullyPublished } from "~utils/logging"
import { validateOptions } from "~utils/validator"

export type ChromeOptions = {
  target?: PublishTarget
} & Options &
  CommonOptions

const market = BrowserName.Chrome

async function deploy({
  extId,
  clientId,
  refreshToken,
  verbose,
  target = "default",
  zip
}: ChromeOptions) {
  const client = new ChromeWebstoreClient({
    extId,
    clientId,
    refreshToken
  })

  if (verbose) {
    console.log(
      getVerboseMessage({
        market,
        message: `Updating extension with ID ${extId}`
      })
    )
  }

  try {
    await client.submit({
      filePath: zip,
      target
    })
  } catch (error) {
    const manifest = getManifestJson(zip)
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

export async function deployChrome(options: ChromeOptions): Promise<boolean> {
  options.zip = getCorrectZip(options.zip)

  validateOptions({
    market,
    options,
    errorMap
  })

  return deploy(options)
}
