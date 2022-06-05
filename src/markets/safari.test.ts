import { expect, test } from "@jest/globals"
import fs from "fs/promises"

import { SafariOptions, submitSafari } from "~index"

test.skip("Safari dry run successful", async () => {
  const options = JSON.parse(await fs.readFile("keys.json", "utf8"))
    .safari as SafariOptions

  expect(
    await submitSafari({
      verbose: true,
      dryRun: true,
      zip: "test.zip",
      ...options
    })
  ).toBeTruthy()
})
