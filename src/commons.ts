export enum BrowserName {
  Chrome = "chrome",
  Firefox = "firefox",
  Opera = "opera",
  Edge = "edge"
}

export const supportedBrowserSet = new Set([
  BrowserName.Chrome,
  BrowserName.Firefox,
  BrowserName.Opera,
  BrowserName.Edge
])

export const marketNameMap = {
  [BrowserName.Chrome]: "Chrome Web Store",
  [BrowserName.Firefox]: "Firefox Add-ons",
  [BrowserName.Opera]: "Opera Add-ons",
  [BrowserName.Edge]: "Edge Add-ons"
}

export type CommonOptions = {
  /**
   * The path to the ZIP, relative from the current working directory (`process.cwd()`)<br>
   * You can use `{version}`, which will be replaced by the `version` entry from your `package.json`, e.g. `some-zip-v{version}.zip`
   */
  zip: string

  /** If `true`, every step of uploading to the Firefox Add-ons will be logged to the console. */
  verbose?: boolean
}
