import { expect, test } from "@jest/globals"
import fs from "fs/promises"

import { FirefoxOptions, deployFirefox } from "~index"

test("Firefox dry run successful", async () => {
  const opt = JSON.parse(await fs.readFile("keys.json", "utf8"))
    .firefox as FirefoxOptions

  expect(
    await deployFirefox({
      verbose: true,
      dryRun: true,
      zip: "test.zip",
      ...opt
    })
  ).toBeTruthy()
})
