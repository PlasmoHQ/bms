import { IteroTestBedAPI, Options, errorMap } from "@plasmohq/itero-testbed-api"

import { BrowserName, CommonOptions } from "~commons"
import { getVerboseError } from "~utils/error"
import { getCorrectZip } from "~utils/file"
import {
  enableVerboseLogging,
  getVerboseLogger,
  logSuccessfullyPublished
} from "~utils/logging"
import { validateOptions } from "~utils/validator"

export type IteroOptions = Options & CommonOptions

const market = BrowserName.Firefox

const vLog = getVerboseLogger(market)

async function submit({ zip, dryRun, ...opts }: IteroOptions) {
  const client = new IteroTestBedAPI({
    ...opts
  })

  vLog(`Updating extension to Itero TestBed`)
  if (dryRun) {
    return true
  }

  try {
    await client.submit({
      filePath: zip
    })
    logSuccessfullyPublished({ market, zip })

    return true
  } catch (error) {
    throw getVerboseError(error, market)
  }
}

export async function submitItero(options: IteroOptions): Promise<boolean> {
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
