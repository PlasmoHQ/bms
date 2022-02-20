import type { ElementHandle, Page } from "puppeteer"

export async function disableImages(page: Page) {
  await page.setRequestInterception(true)
  page.on("request", (request) => {
    if (request.resourceType() === "image") {
      request.abort()
      return
    }
    request.continue()
  })
}

export async function getExistingElementSelector(
  page: Page,
  selectors: string[]
): Promise<string> {
  const promises = selectors.map((selector) => page.waitForSelector(selector))
  const {
    // @ts-ignore
    _remoteObject: { description }
  } = await Promise.race(promises)
  return description
}

export async function getPropertyValue({
  element,
  propertyName
}: {
  element: ElementHandle
  propertyName: string
}) {
  const property = await element.getProperty(propertyName)
  return property._remoteObject.value
}
