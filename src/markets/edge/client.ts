import { BrowserName } from "~commons"
import { getVerboseMessage } from "~utils/logging"

import { EdgeOptions as Options, errorMap, requiredFields } from "./options"

/**
 * WIP Edge Webstore Client, just some basic scaffolding for now
 */
export class EdgeWebstoreClient {
  options = {} as Options

  constructor(options: Options) {
    for (const field of requiredFields) {
      if (!options[field]) {
        throw new Error(errorMap[field])
      }

      this.options[field] = options[field]
    }
  }

  vLog = (message: string) =>
    this.options.verbose &&
    console.log(
      getVerboseMessage({
        market: BrowserName.Edge,
        message
      })
    )
}
