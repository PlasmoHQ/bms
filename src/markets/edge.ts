import { EdgeAddonsAPI, Options, errorMap } from "@plasmohq/edge-addons-api"

import { BrowserName, CommonOptions } from "~commons"
import { getVerboseError } from "~utils/error"
import { getCorrectZip, getManifestJson } from "~utils/file"
import {
  enableVerboseLogging,
  getVerboseLogger,
  logSuccessfullyPublished
} from "~utils/logging"
import { validateOptions } from "~utils/validator"

export type EdgeOptions = Options & CommonOptions
const market = BrowserName.Edge

const vLog = getVerboseLogger(market)

async function submit({ productId, notes, zip, dryRun, ...opts }: EdgeOptions) {
  const manifest = getManifestJson(zip)

  const client = new EdgeAddonsAPI({
    productId,
    ...opts
  })

  vLog(`Updating extension with Product ID ${productId}`)

  if (dryRun) {
    return true
  }

  try {
    await client.submit({
      filePath: zip,
      notes
    })
    logSuccessfullyPublished({ extId: productId, market, zip })

    return true
  } catch (error) {
    throw getVerboseError(error, market, `"${productId}" (${manifest.name})`)
  }
}

export async function submitEdge(options: EdgeOptions): Promise<boolean> {
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
