import { expect, test } from "@jest/globals"
import fs from "fs/promises"

import { ChromeOptions, deployChrome } from "~index"

test("Chrome dry run successful", async () => {
  const opt = JSON.parse(await fs.readFile("keys.json", "utf8"))
    .chrome as ChromeOptions

  expect(
    await deployChrome({
      verbose: true,
      dryRun: true,
      zip: "test.zip",
      ...opt
    })
  ).toBeTruthy()
})
