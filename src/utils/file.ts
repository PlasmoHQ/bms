import { strFromU8, unzipSync } from "fflate"
import { existsSync, readFileSync } from "fs"
import { resolve } from "path"
import { cwd } from "process"

export const getFullPath = (file: string) => resolve(cwd(), file)

export const getIsFileExists = (file: string) => existsSync(getFullPath(file))

export function getCorrectZip({
  zip = "",
  versionFile = "package.json"
}): string {
  if (getIsFileExists(versionFile) && zip.includes("{version}")) {
    const packageJson = JSON.parse(readFileSync(versionFile).toString())
    return zip.replace("{version}", packageJson.version || "")
  } else {
    return zip
  }
}

export function getManifestJson(zip: string) {
  const fileBuffer = readFileSync(getFullPath(zip))
  const unzip = unzipSync(fileBuffer)
  const manifest = strFromU8(unzip["manifest.json"])
  return JSON.parse(manifest)
}
