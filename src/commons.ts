export enum BrowserName {
  Chrome = "chrome",
  Firefox = "firefox",
  Opera = "opera",
  Edge = "edge"
}

export const supportedBrowserSet = new Set([
  BrowserName.Chrome,
  BrowserName.Edge,
  BrowserName.Firefox
  // BrowserName.Opera,
])

export const marketNameMap = {
  [BrowserName.Chrome]: "Chrome Web Store",
  [BrowserName.Edge]: "Edge Add-ons",
  [BrowserName.Firefox]: "Firefox Add-ons"
  // [BrowserName.Opera]: "Opera Add-ons",
}

export type CommonOptions = {
  /**
   * The path to the ZIP, relative from the current working directory (`process.cwd()`)
   * You can use `{version}`, which will be replaced by the `version` entry from your `package.json` or versionFile, e.g. `some-zip-v{version}.zip`
   */
  zip: string

  /**
   * The path to a json file which has a `version` field. Defaults to `package.json`
   */
  versionFile?: string

  /** If `true`, every step of uploading will be logged to the console. */
  verbose?: boolean

  /** If `true`, it will only upload the zip but does not actually hit submission */
  dryRun?: boolean

  /** Release notes */
  notes?: string
}
