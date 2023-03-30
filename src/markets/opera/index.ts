import { BrowserName } from "~commons.js"
import { getCorrectZip } from "~utils/file.js"
import { enableVerboseLogging } from "~utils/logging"
import { validateOptions } from "~utils/validator.js"

import { type OperaOptions, errorMap } from "./options"

export type { OperaOptions }

const market = BrowserName.Opera

export async function submitOpera(options: OperaOptions): Promise<boolean> {
  options.zip = getCorrectZip(options)

  if (options.changelog) {
    options.changelog = options.changelog.replace(/\/\/n/g, "\n")
  }

  if (options.verbose) {
    enableVerboseLogging(market)
  }

  validateOptions({ market, options, errorMap })

  throw new Error(
    "Opera submission is not supported at this time, due to lack of automation API - their CSRF token and cookies expires in 24 hours. It will be faster to just drag/drop the zip on their dev portal."
  )
}
