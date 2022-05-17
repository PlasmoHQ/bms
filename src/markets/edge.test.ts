import { expect, test } from "@jest/globals"
import fs from "fs/promises"

import type { EdgeOptions } from "~index"
import { submitEdge } from "~index"

test("Edge dry run successful", async () => {
  const opt = JSON.parse(await fs.readFile("keys.json", "utf8"))
    .edge as EdgeOptions

  expect(
    await submitEdge({
      verbose: true,
      dryRun: true,
      zip: "test.zip",
      ...opt
    })
  ).toBeTruthy()
})
