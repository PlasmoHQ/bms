import compareVersions from "compare-versions"
import { default as duration } from "parse-duration"
import puppeteer, { Page } from "puppeteer"

import { BrowserName } from "~commons.js"
import { getManifestJson } from "~utils/file.js"
import { getVerboseMessage, logSuccessfullyPublished } from "~utils/logging.js"
import { disableImages, getExistingElementSelector } from "~utils/puppeteer.js"

import type { EdgeOptions } from "./options.js"

const market = BrowserName.Edge

const gSelectors = {
  extName: ".extension-name",
  inputFile: "input[type=file]",
  buttonPublishText: "#publish-button",
  buttonPublish: "#publishButton",
  buttonPublishOverview: "[data-l10n-key=Common_Publish]",
  buttonEditOverview: "[data-l10n-key=Common_Text_Edit]",
  buttonUpdateOverview: "[data-l10n-key=Common_Text_Update]",
  statusInReview: "[data-l10n-key=Overview_Extension_Status_InReview]",
  errorIncompleteTranslations: `[data-l10n-key="Common_Incomplete"]`,
  buttonPackageNext: "#nextbtn",
  buttonSubmissionUpdate: "[data-l10n-key=Common_Text_Update]",
  buttonCancelOverview: "[data-l10n-key=Common_Text_Cancel]",
  buttonConfirm: "[data-l10n-key=Common_Text_Confirm]",
  inputDevChangelog: `textarea[name="certificationNotes"]`
}

const getBaseUrl = (extId: string) =>
  `https://partner.microsoft.com/en-us/dashboard/microsoftedge/${extId}`

// getBaseUrl(extId)}/availability

const getPackageUrl = (extId: string) => `${getBaseUrl(extId)}/package`
const getListingsUrl = (extId: string) => `${getBaseUrl(extId)}/listings`
const getAvailabilityUrl = (extId: string) =>
  `${getBaseUrl(extId)}/availability`
const getDashboardUrl = (extId: string) => `${getPackageUrl(extId)}/dashboard`

async function openRelevantExtensionPage({ page = null as Page, extId = "" }) {
  return new Promise(async (resolve, reject) => {
    const responseListener = (response) => {
      if (!response.url().endsWith("lastUploadedPackage")) {
        const isCookieInvalid = response
          .url()
          .startsWith("https://login.microsoftonline.com")
        if (isCookieInvalid) {
          reject(
            getVerboseMessage({
              market,
              message:
                "Invalid/expired cookie. Please get a new one, e.g. by running: npx web-ext-deploy --get-cookies=edge",
              prefix: "Error"
            })
          )
        }
        return
      }
      const error = 400
      const isExtIdValid = response.status() !== error
      if (isExtIdValid) {
        page.off("response", responseListener)
        return
      }
      reject(
        getVerboseMessage({
          market,
          message: `Extension with ID "${extId}" does not exist`,
          prefix: "Error"
        })
      )
    }
    page.on("response", responseListener)

    page
      .goto(getDashboardUrl(extId))
      .then(() => resolve(true))
      .catch(() => {})
  })
}

async function getCurrentVersion({ page = null as Page }): Promise<string> {
  await page.waitForSelector(gSelectors.extName)
  const elNameVersionContainers = await page.$$(gSelectors.extName)
  const elNameVersionContainer =
    elNameVersionContainers[elNameVersionContainers.length - 1]

  const [elVersion] = await elNameVersionContainer.$x("span[3]")
  return elVersion.evaluate((elVersion: HTMLSpanElement) =>
    elVersion.textContent.trim()
  )
}

async function uploadZip({
  page,
  zip,
  extId
}: {
  page: Page
  zip: string
  extId: string
}) {
  await page.goto(getPackageUrl(extId), {
    waitUntil: "networkidle0"
  })
  const elInputFile = await page.$(gSelectors.inputFile)
  await elInputFile.uploadFile(zip)
}

async function verifyNewVersionIsGreater({ page = null as Page, zip = "" }) {
  const versionCurrent = await getCurrentVersion({ page })
  const versionNew = getManifestJson(zip)["version"]

  return new Promise(async (resolve, reject) => {
    // @ts-ignore
    if (compareVersions(versionNew, versionCurrent, ">")) {
      resolve(true)
      return
    }
    const extName = getManifestJson(zip)["name"]
    reject(
      getVerboseMessage({
        market,
        message: `${extName}'s new version (${versionNew}) must be greater than the current version (${versionCurrent})`,
        prefix: "Error"
      })
    )
  })
}

async function addLoginCookie({
  page,
  cookie
}: {
  page: Page
  cookie: string
}) {
  const domain = "partner.microsoft.com"
  const cookies = [
    {
      name: ".AspNet.Cookies",
      value: cookie,
      domain
    }
  ]
  await page.setCookie(...cookies)
}

async function clickButtonNext({ page }: { page: Page }) {
  await page.$eval(
    gSelectors.buttonPackageNext,
    (elPackageNext: HTMLButtonElement) => {
      return new Promise((resolve) => {
        new MutationObserver(() => resolve(true)).observe(elPackageNext, {
          attributes: true,
          attributeFilter: ["disabled"]
        })
      })
    }
  )

  await page.click(gSelectors.buttonPackageNext)
}

async function getLanguages({ page }: { page: Page }) {
  return page.$$eval(
    gSelectors.errorIncompleteTranslations,
    (elIncompletes: HTMLDivElement[]) =>
      elIncompletes
        .map((elIncomplete) =>
          elIncomplete
            .closest("tr")
            .querySelector(".action-link")
            .childNodes[0].textContent.trim()
        )
        .join(", ")
  )
}

async function verifyNoListingIssues({
  page,
  extId
}: {
  page: Page
  extId: string
}) {
  return new Promise(async (resolve, reject) => {
    page.once("dialog", (dialog) => {
      dialog.accept()
    })

    await page.goto(getListingsUrl(extId), {
      waitUntil: "networkidle0"
    })

    const languagesMissing = await getLanguages({ page })
    if (languagesMissing.length === 0) {
      resolve(true)
      return
    }

    reject(
      getVerboseMessage({
        market,
        message: `The following languages lack their translated descriptions and/or logos: ${languagesMissing}`,
        prefix: "Error"
      })
    )
  })
}

async function addChangelogIfNeeded({
  page,
  devChangelog,
  isVerbose
}: {
  devChangelog: string
  page: Page
  isVerbose: boolean
}) {
  if (!devChangelog) {
    return
  }
  await page.waitForSelector(gSelectors.inputDevChangelog)
  await page.type(gSelectors.inputDevChangelog, devChangelog)
  if (isVerbose) {
    console.log(
      getVerboseMessage({
        market,
        message: `Added changelog for reviewers: ${devChangelog}`
      })
    )
  }
}

async function clickButtonPublish({ page }: { page: Page }) {
  await page.waitForSelector(gSelectors.buttonPublish)
  await page.$eval(gSelectors.buttonPublish, (elPublish: HTMLButtonElement) => {
    return new Promise((resolve) => {
      new MutationObserver(() => resolve(true)).observe(elPublish, {
        attributes: true,
        attributeFilter: ["disabled"]
      })
    })
  })

  await page.click(gSelectors.buttonPublish)
}

async function clickButtonPublishText(page: Page, extId: string) {
  await page.goto(getAvailabilityUrl(extId), {
    waitUntil: "networkidle0"
  })
  await page.waitForSelector(gSelectors.buttonPublishText)
  await page.click(gSelectors.buttonPublishText)
}

async function clickPublishInOverview({
  page,
  extId
}: {
  page: Page
  extId: string
}) {
  const urlOverview = getDashboardUrl(extId)
  await page.goto(urlOverview, { waitUntil: "networkidle0" })
  await page.waitForSelector(gSelectors.buttonPublishOverview)
  await page.click(gSelectors.buttonPublishOverview)
}

async function clickCancelWhenPossible({ page }: { page: Page }) {
  const timeToWait = duration("65s")
  // noinspection UnnecessaryLocalVariableJS
  const isCanceled = await page.$eval(
    gSelectors.buttonCancelOverview,
    (elButtonCancel: HTMLButtonElement, timeToWait: number) =>
      new Promise((resolve) => {
        // If the extension had been reviewed
        // and then its review process was canceled,
        // the Cancel button will become clickable
        // after a minute

        setTimeout(() => resolve(false), timeToWait)

        // Otherwise, if it hasn't just been canceled,
        // the button will start as disabled and become
        // enabled after a moment
        new MutationObserver(() => {
          elButtonCancel.click()
          resolve(true)
        }).observe(elButtonCancel, {
          attributes: true,
          attributeFilter: ["disabled"]
        })
      }),
    timeToWait
  )

  return isCanceled
}

async function confirmCancelWhenPossible({ page }: { page: Page }) {
  await page.waitForSelector(gSelectors.buttonConfirm)
  await page.$eval(gSelectors.buttonConfirm, (elConfirm: HTMLButtonElement) =>
    elConfirm.click()
  )
}

async function cancelVersionInReviewIfNeeded({
  page,
  isVerbose,
  zip
}: {
  page: Page
  isVerbose: boolean
  zip: string
}) {
  // Scenario 1: It's live in the store (Update & Unpublish are available)
  // Scenario 2: It's in draft form (Edit, Publish & Unpublish are available)
  // Scenario 3: It's being reviewed (Update, Cancel & Unpublish are available)
  // Scenario 4: The review was canceled, but it's not yet a draft (Update, Cancel (disabled) & Unpublish are available)

  const selectorExisting = await getExistingElementSelector(page, [
    gSelectors.buttonEditOverview,
    gSelectors.buttonUpdateOverview
  ])

  const isInStore = !(await page.$(gSelectors.buttonCancelOverview))
  const isDraft = selectorExisting.includes(gSelectors.buttonEditOverview)
  if (isInStore || isDraft) {
    return
  }

  const isScenario4 = !(await clickCancelWhenPossible({ page }))
  if (isScenario4) {
    return
  }
  await confirmCancelWhenPossible({ page })

  if (isVerbose) {
    const extName = getManifestJson(zip)["name"]
    console.log(
      getVerboseMessage({
        market,
        message: `Canceling current being-reviewed version. It will take about a minute until the new version of ${extName} can be uploaded`
      })
    )
  }

  await new Promise((resolve) =>
    setTimeout(() => resolve(true), duration("65s"))
  )
}

async function getIsInStore({ page }: { page: Page }) {
  // In-store: Update & Unpublish are available
  // In-draft: Edit, Publish & Unpublish are available
  // In-review: Update, Cancel (initially disabled) & Unpublish are available
  return (
    (await page.$(gSelectors.buttonUpdateOverview)) &&
    !(await page.$(gSelectors.buttonCancelOverview))
  )
}

export async function deployToEdge({
  cookie,
  extId,
  devChangelog = "",
  zip,
  verbose,
  dryRun = false
}: EdgeOptions): Promise<boolean> {
  const [width, height] = [1280, 720]
  const puppeteerArgs =
    process.env.NODE_ENV === "test"
      ? {
          headless: false,
          defaultViewport: { width, height },
          args: [`--window-size=${width},${height} --window-position=0,0`]
        }
      : {}
  const browser = await puppeteer.launch(puppeteerArgs)

  const [page] = await browser.pages()
  await disableImages(page)
  await addLoginCookie({ page, cookie })
  const urlStart = getDashboardUrl(extId)

  const vLog = (message: string) =>
    verbose &&
    console.log(
      getVerboseMessage({
        market,
        message
      })
    )

  try {
    vLog(`Launched a Puppeteer session in ${urlStart}`)

    await page.goto(urlStart)

    await openRelevantExtensionPage({ page, extId })

    vLog("Opened relevant extension page")

    await cancelVersionInReviewIfNeeded({ page, isVerbose: verbose, zip })

    if (await getIsInStore({ page })) {
      await verifyNewVersionIsGreater({ page, zip })
    }

    vLog(`Uploading ZIP: ${zip}`)

    await uploadZip({ page, zip, extId })

    await clickButtonNext({ page })

    vLog("Uploaded ZIP")

    await verifyNoListingIssues({ page, extId })

    await clickButtonPublishText(page, extId)
    await addChangelogIfNeeded({ page, devChangelog, isVerbose: verbose })

    if (!dryRun) {
      await clickButtonPublish({ page })

      const minutesToWait = 10
      const timeout = duration(`${minutesToWait}m`)
      try {
        await page.waitForSelector(gSelectors.buttonSubmissionUpdate, {
          timeout
        })
      } catch {
        await clickPublishInOverview({ page, extId })
        await page.waitForSelector(gSelectors.statusInReview, {
          timeout
        })
      }
      logSuccessfullyPublished({ extId, market, zip })
    }

    await browser.close()

    return true
  } catch (error) {
    await browser.close()
    const stackedError = new Error(
      getVerboseMessage({
        market,
        message: `Item "${extId}": ${error.message}`,
        prefix: "Error"
      })
    )
    stackedError.stack = error.stack
    throw stackedError
  }
}
