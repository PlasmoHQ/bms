import { strFromU8, unzipSync } from "fflate"
import { existsSync, readFileSync } from "fs"
import { resolve } from "path"
import { cwd } from "process"

import type { CommonOptions } from "~commons"

export const getFullPath = (file: string) => resolve(cwd(), file)

export const getIsFileExists = (file: string) => existsSync(getFullPath(file))

export function getCorrectZip({
  zip = "",
  file = "",
  versionFile = "package.json"
}: CommonOptions): string {
  const output = zip || file

  if (getIsFileExists(versionFile) && output.includes("{version}")) {
    const packageJson = JSON.parse(readFileSync(versionFile).toString())
    return output.replace("{version}", packageJson.version || "")
  } else {
    return output
  }
}

export function getManifestJson(zip: string) {
  const fileBuffer = readFileSync(getFullPath(zip))
  const unzip = unzipSync(fileBuffer)
  const manifest = strFromU8(unzip["manifest.json"])
  return JSON.parse(manifest)
}
