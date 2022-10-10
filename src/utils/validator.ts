import { BrowserName, CommonOptions } from "~commons"

import { getFullPath, getIsFileExists } from "./file"

function getErrorMessage(market: BrowserName, message: string): string {
  return `${market}: ${message}`
}

export const validateOptions = ({
  market = BrowserName.Chrome,
  options = {} as CommonOptions,
  errorMap = {} as Record<string, string>
}) => {
  const requiredFields = Object.keys(errorMap)
  requiredFields.some((key) => {
    if (!options[key]) {
      throw new Error(getErrorMessage(market, errorMap[key]))
    }
  })

  if (!options.zip && !options.file) {
    throw new Error(getErrorMessage(market, "No extension bundle provided"))
  }

  const filePath = options.zip || options.file

  if (!getIsFileExists(filePath)) {
    throw new Error(
      getErrorMessage(
        market,
        `Extension bundle file doesn't exist: ${getFullPath(filePath)}`
      )
    )
  }
}
