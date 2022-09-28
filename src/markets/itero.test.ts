import { expect, test } from "@jest/globals"
import fs from "fs/promises"

import { IteroOptions, submitItero } from "./itero"

test("Itero dry run successful", async () => {
  const opt = JSON.parse(await fs.readFile("keys.json", "utf8"))
    .itero as IteroOptions

  expect(
    await submitItero({
      verbose: true,
      dryRun: true,
      zip: "test.zip",
      ...opt
    })
  ).toBeTruthy()
})
