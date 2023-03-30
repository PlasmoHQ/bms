import { expect, test } from "@jest/globals"
import fs from "fs/promises"

import { type OperaOptions, submitOpera } from "~index"

test.skip("Opera dry run successful", async () => {
  const opt = JSON.parse(await fs.readFile("keys.json", "utf8"))
    .chrome as OperaOptions

  expect(
    await submitOpera({
      verbose: true,
      dryRun: true,
      zip: "test.zip",
      ...opt
    })
  ).toBeTruthy()
})
