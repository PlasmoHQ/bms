import type { CommonOptions } from "~commons"

export type EdgeOptions = {
  /** The cookie required to login to the publisher's account, called: `.AspNet.Cookies`<br>
   * If you have a hard time obtaining it, run: `--get-cookies=edge` */
  cookie: string

  /** The extension ID. E.g. `https://partner.microsoft.com/en-us/dashboard/microsoftedge/EXT_ID` */
  extId: string

  /**
   * A description of the technical changes made in this version, compared to the previous one.<br>
   * This will only be seen by the Edge Extensions reviewers.<br>
   * It's recommended to use instead `--edge-dev-changelog` , so it stays up to date.
   */
  devChangelog?: string
} & CommonOptions

export const errorMap = {
  extId:
    "No extension ID is provided, e.g. https://partner.microsoft.com/en-us/dashboard/microsoftedge/EXT_ID",
  cookie:
    "No cookie is provided. The cookie's name is '.AspNet.Cookies'. If you have a hard time obtaining it, run: npx web-ext-deploy --get-cookies=edge"
}
