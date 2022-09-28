<p align="center">
  <a href="https://plasmo.com">
    <img alt="plasmo logo banner" width="75%" src="https://www.plasmo.com/assets/banner-black-on-white.png" />
  </a>
</p>

<p align="center">
  <a aria-label="License" href="./LICENSE">
    <img alt="See License" src="https://img.shields.io/npm/l/@plasmohq/bms"/>
  </a>
  <a aria-label="NPM" href="https://www.npmjs.com/package/@plasmohq/bms">
    <img alt="NPM Install" src="https://img.shields.io/npm/v/@plasmohq/bms?logo=npm"/>
  </a>
  <a aria-label="Twitter" href="https://www.twitter.com/plasmohq">
    <img alt="Follow PlasmoHQ on Twitter" src="https://img.shields.io/twitter/follow/plasmohq?logo=twitter"/>
  </a>
  <a aria-label="Twitch Stream" href="https://www.twitch.tv/plasmohq">
    <img alt="Watch our Live DEMO every Friday" src="https://img.shields.io/twitch/status/plasmohq?logo=twitch&logoColor=white"/>
  </a>
  <a aria-label="Discord" href="https://www.plasmo.com/s/d">
    <img alt="Join our Discord for support and chat about our projects" src="https://img.shields.io/discord/946290204443025438?logo=discord&logoColor=white"/>
  </a>
  <a aria-label="Build status" href="https://github.com/PlasmoHQ/bpp/actions">
    <img alt="typescript-action status" src="https://github.com/PlasmoHQ/bpp/workflows/build-test/badge.svg"/>
  </a>
</p>

# Browser Market Submit

A NodeJS library from [Plasmo](https://www.plasmo.com/) to submit browser extensions to multiple stores. It is made to be used in the [Browser Platform Publisher](https://bpp.browser.market) action.

Supported stores:

- [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/extensions)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons)
- [Itero TestBed](https://itero.plasmo.com)

Unsupported stores:

- [Opera Add-ons](https://addons.opera.com/en/extensions): They do not have an automation API, and their cookie expires in 24 hours, making them unsuitable for CI/CD.

# Core packages used

- [@plasmohq/chrome-webstore-api](https://github.com/PlasmoHQ/chrome-webstore-api) - for uploading extensions to Chrome Web Store.
- [@plasmohq/mozilla-addons-api](https://github.com/PlasmoHQ/mozilla-addons-api) - for signing and uploading extensions to Firefox Addon API.
- [@plasmohq/edge-addons-api](https://github.com/PlasmoHQ/edge-addons-api) - for uploading and publishing extensions to Edge Add-ons API.

# Installing

```shell
npm i -D @plasmohq/bms
# or
pnpm i -D @plasmohq/bms
# or
yarn add -D @plasmohq/bms
```

# Usage

Following this [doc](./tokens.md) to gather the tokens necessary for the deployment, OR use [bpp's json schema](https://raw.githubusercontent.com/PlasmoHQ/bpp/v2/keys.schema.json) which provides intellisense on editors such as vscode. To use the json schema, create a `keys.json` file in vscode with the following content:

```json
{
  "$schema": "https://raw.githubusercontent.com/PlasmoHQ/bpp/v2/keys.schema.json"
}
```

Then, the nodejs API can be consumed as follows:

<!-- prettier-ignore -->
```ts
import {
  submitChrome,
  submitEdge,
  submitFirefox,
} from "@plasmohq/bms"

submitChrome({
  extId: "EXT_ID",
  refreshToken: "refreshToken",
  clientId: "clientIdsubmit",
  clientSecret: "clientSecret",
  zip: "dist/some-zip-v{version}.zip",
  verbose: false
})

submitFirefox({
  extId: "EXT_ID",
  apiKey: "api_key",
  apiSecret: "api_secret",
  zip: "dist/some-zip-v{version}.zip",
  verbose: false
})

submitEdge({
  clientId: "aaaaaaa-aaaa-bbbb-cccc-dddddddddddd",
  clientSecret: "abcdefg",
  productId: "aaaaaaa-aaaa-bbbb-cccc-dddddddddddd",
  accessTokenUrl: "https://login.microsoftonline.com/aaaaaaa-aaaa-bbbb-cccc-dddddddddddd/oauth2/v2.0/token",
  zip: "dist/some-zip-v{version}.zip",
  notes: "Changes for reviewers",
  verbose: false
})
```

# Support

Join our [Discord channel](https://www.plasmo.com/s/d)!

# Acknowledgment

This library was inspired by:

- [web-ext-deploy](https://github.com/avi12/web-ext-deploy) by [avi12](https://github.com/avi12)
  - The documentation and API of bms is largely inspired by web-ext-deploy.
- [chrome-webstore-upload-cli](https://github.com/fregante/chrome-webstore-upload-cli) by [fregante](https://github.com/fregante)
- [web-ext](https://github.com/mozilla/web-ext) by [mozilla](https://github.com/mozilla)

# License

[MIT](./license) ⭐ [Plasmo Corp.](https://plasmo.com)
