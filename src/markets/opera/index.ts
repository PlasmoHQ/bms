import { BrowserName } from "~commons.js"
import { getCorrectZip } from "~utils/file.js"
import { enableVerboseLogging } from "~utils/logging"
import { validateOptions } from "~utils/validator.js"

import { OperaOptions, errorMap } from "./options"
import { submitToOpera } from "./submit"

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

  return submitToOpera(options)
}
