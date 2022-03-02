import type { BrowserName } from "~commons"

import { getVerboseMessage } from "./logging"

export const getVerboseError = (
  error: Error,
  market: BrowserName,
  itemId?: string
) => {
  const stackedError = new Error(
    getVerboseMessage({
      market,
      message: `Item "${itemId}": ${error.message}`,
      prefix: "Error"
    })
  )
  stackedError.stack = error.stack
  return stackedError
}
