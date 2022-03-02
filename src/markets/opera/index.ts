import { BrowserName } from "~commons.js"
import { getCorrectZip } from "~utils/file.js"
import { enableVerboseLogging } from "~utils/logging"
import { validateOptions } from "~utils/validator.js"

import { deployToOpera } from "./deploy"
import { OperaOptions, errorMap } from "./options"

export type { OperaOptions }

const market = BrowserName.Opera

export async function deployOpera(options: OperaOptions): Promise<boolean> {
  options.zip = getCorrectZip(options)

  if (options.changelog) {
    options.changelog = options.changelog.replace(/\/\/n/g, "\n")
  }

  if (options.verbose) {
    enableVerboseLogging(market)
  }

  validateOptions({ market, options, errorMap })

  return deployToOpera(options)
}
