import { BrowserName } from "~commons.js"
import { getCorrectZip } from "~utils/file.js"
import { validateOptions } from "~utils/validator.js"

import { deployToEdge } from "./deploy"
import { EdgeOptions, errorMap } from "./options"

export type { EdgeOptions }

const market = BrowserName.Edge

export async function deployEdge(options: EdgeOptions): Promise<boolean> {
  options.zip = getCorrectZip(options)

  if (options.devChangelog) {
    options.devChangelog = options.devChangelog.replace(/\/\/n/g, "\n")
  }

  validateOptions({ market, options, errorMap })

  return deployToEdge(options)
}
