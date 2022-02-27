import { existsSync, readFileSync } from "fs"
import { resolve } from "path"
import { cwd } from "process"
import zipper from "zip-local"

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
  const unzippedFs = zipper.sync.unzip(zip).memory()
  const manifest = unzippedFs.read("manifest.json", "text")
  return JSON.parse(manifest)
}
