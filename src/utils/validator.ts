import { BrowserName } from "~commons"

import { getFullPath, getIsFileExists } from "./file"

function getErrorMessage(market: BrowserName, message: string): string {
  return `${market}: ${message}`
}

export const validateOptions = ({
  market = BrowserName.Chrome,
  options = {} as Record<string, any>,
  errorMap = {} as Record<string, string>
}) => {
  const requiredFields = Object.keys(errorMap)
  requiredFields.some((key) => {
    if (!options[key]) {
      throw new Error(getErrorMessage(market, errorMap[key]))
    }
  })

  if (!options.zip) {
    throw new Error(getErrorMessage(market, "No zip provided"))
  }

  if (!getIsFileExists(options.zip)) {
    throw new Error(
      getErrorMessage(market, `Zip doesn't exist: ${getFullPath(options.zip)}`)
    )
  }
}
