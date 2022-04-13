# Browser Market Submit

This library is used to deploy browser extensions to multiple stores. It is made to be used in [bpp](https://browser.market)

Supported stores:

- [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/extensions)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons)
- [Opera Add-ons](https://addons.opera.com/en/extensions)

# Core packages used

- [@plasmo-corp/cwu](https://github.com/plasmo-corp/cwu) - for uploading extensions to Chrome Web Store.
- [@plasmo-corp/mwu](https://github.com/plasmo-corp/mwu) - for signing and uploading extensions to Firefox Addon API.
- [@plasmo-corp/ewu](https://github.com/plasmo-corp/edge-webstore-upload) - for uploading and publishing extensions to Edge Add-ons API.
- [Puppeteer](https://github.com/puppeteer/puppeteer) - for uploading extensions to Opera Add-ons store.

# Installing

```shell
npm i -D @plasmo-corp/bms
# or
pnpm i -D @plasmo-corp/bms
# or
yarn add -D @plasmo-corp/bms
```

# Usage

Following this [doc](./tokens.md) to gather the tokens necessary for the deployment, OR use [bpp's json schema](https://raw.githubusercontent.com/plasmo-corp/bpp/v1/keys.schema.json) which provides intellisense on editors such as vscode. To use the json schema, create a `keys.json` file in vscode with the following content:

```json
{
  "$schema": "https://raw.githubusercontent.com/plasmo-corp/bpp/v1/keys.schema.json"
}
```

Then, the nodejs API can be consumed as follows:

<!-- prettier-ignore -->
```ts
import {
  deployChrome,
  deployEdge,
  deployFirefox,
  deployOpera,
} from "@plasmo-corp/bms"

deployChrome({
  extId: "EXT_ID",
  refreshToken: "refreshToken",
  clientId: "clientId",
  zip: "dist/some-zip-v{version}.zip",
  verbose: false
})

deployFirefox({
  extId: "EXT_ID",
  apiKey: "api_key",
  apiSecret: "api_secret",
  zip: "dist/some-zip-v{version}.zip",
  verbose: false
})

deployEdge({
  clientId: "aaaaaaa-aaaa-bbbb-cccc-dddddddddddd",
  clientSecret: "abcdefg",
  productId: "aaaaaaa-aaaa-bbbb-cccc-dddddddddddd",
  accessTokenUrl: "https://login.microsoftonline.com/aaaaaaa-aaaa-bbbb-cccc-dddddddddddd/oauth2/v2.0/token",
  zip: "dist/some-zip-v{version}.zip",
  notes: "Changes for reviewers",
  verbose: false
})

deployOpera({
  packageId: "123456",
  sessionid: "sessionid_value",
  csrftoken: "csrftoken_value",
  zip: "dist/some-zip-v{version}.zip",
  changelog: "Some changes",
  verbose: false
})
```

# Support

Join the [Discord channel](https://discord.browser.market)!

# Acknowledgment

This library was inspired by:

- [web-ext-deploy](https://github.com/avi12/web-ext-deploy) by [avi12](https://github.com/avi12)
  - The documentation and API of bms is largely inspired by web-ext-deploy.
- [chrome-webstore-upload-cli](https://github.com/fregante/chrome-webstore-upload-cli) by [fregante](https://github.com/fregante)
- [web-ext](https://github.com/mozilla/web-ext) by [mozilla](https://github.com/mozilla)

# License

[MIT](./license) ⭐ [Plasmo Corp.](https://plasmo.com)
