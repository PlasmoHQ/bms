import type { CommonOptions } from "~commons"

export type OperaOptions = {
  /** The `sessionid` cookie to login to the publisher's account. */
  sessionid: string

  /** The `csrftoken` cookie to upload the ZIP. */
  csrftoken: string

  /** The extension ID. E.g. `https://addons.opera.com/developer/package/PACKAGE_ID` */
  packageId: string

  /**
   * A description of the changes in this version, compared to the previous one.<br>
   * It's recommended to use instead `--opera-changelog` , so it stays up to date.
   */
  changelog?: string
} & CommonOptions

export const errorMap = {
  packageId: `No package ID is provided, e.g. https://addons.opera.com/developer/package/PACKAGE_ID`,
  sessionid: `No "sessionid" is provided. If you have a hard time obtaining it, run:
web-ext-deploy --get-cookies=opera`,
  csrftoken: `No "csrftoken" is provided. If you have a hard time obtaining it, run:
web-ext-deploy --get-cookies=opera`
}
