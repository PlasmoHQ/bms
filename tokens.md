# Tokens

- [Chrome Web Store](#chrome-web-store-api)
- [Firefox Add-ons](#firefox-add-ons-api)
- [Edge Add-ons](#edge-add-ons-api)
- [Itero TestBed](#itero-testbed-api)

## Common Options

These properties are available to every client API calls:

| Argument      | Description | How to Obtain                                                                                                                             |
| ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `zip`         | string      | Relative path from the root to the ZIP. You can use `{version}` template string to substitute the `version` entry from your `versionFile` |
| `file`        | string?     | Alias to zip                                                                                                                              |
| `versionFile` | string?     | Relative path to a json file which has a `version` field. Defaults to `package.json`                                                      |
| `verbose`     | boolean?    | Enable verbose logging                                                                                                                    |
| `note`        | string?     | Notes for certification, which will be visible to the extension reviewers (recommended for Edge)                                          |

## Chrome Web Store API

`submitChrome`

| Argument       | Description | How to Obtain                                                                                                                                     |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `extId`        | string      | Get it from `https://chrome.google.com/webstore/detail/EXT_ID`, e.g. `https://chrome.google.com/webstore/detail/fcphghnknhkimeagdglkljinmpbagone` |
| `refreshToken` | string      | [Guide](https://github.com/PlasmoHQ/chrome-webstore-api/blob/main/token.md)                                                                       |
| `clientId`     | string      | [Guide (same as refreshToken)](https://github.com/PlasmoHQ/chrome-webstore-api/blob/main/token.md)                                                |
| `clientSecret` | string      | [Guide (same as refreshToken)](https://github.com/PlasmoHQ/chrome-webstore-api/blob/main/token.md)                                                |
| `target`       | string      | The target to deploy to, either "default" or "trustedTesters". Defaults to "default".                                                             |

Returns `Promise<true>` or throws an exception on failure.

## Firefox Add-ons API

`submitFirefox`

| Argument    | Description | How to Obtain                                                                                                                                                                                                |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apiKey`    | string      | https://addons.mozilla.org/en-US/developers/addon/api/key/                                                                                                                                                   |
| `apiSecret` | string      | https://addons.mozilla.org/en-US/developers/addon/api/key/                                                                                                                                                   |
| `extId`     | string      | This is the extension UUID, get it from https://addons.mozilla.org/en-US/developers/addon/{ext-name}/edit, under Technical Details. If it is embedded in your manifest under gecko.id, _omit this property_. |

Returns `Promise<true>` or throws an exception.

## Edge Add-ons API

`submitEdge`

| Argument         | Description | How to Obtain                                                                                                                               |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `productId`      | string      | Create an edge add-on and go to the dashboard: `https://partner.microsoft.com/en-us/dashboard/microsoftedge/{product-id}/package/dashboard` |
| `clientId`       | string      | https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi                                                                      |
| `clientSecret`   | string      | https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi                                                                      |
| `accessTokenUrl` | string      | https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi                                                                      |

Returns `Promise<true>` or throws an exception.

> **Note:**
>
> Due to the way the Edge dashboard works, when an extension is being reviewed or its review has just been canceled, it will take about a minute until a cancellation will cause its state to change from "In review" to "In draft", after which the new version can be submitted.
>
> Therefore, expect for longer wait times if you run the tool on an extension you had just published/canceled.

## Itero TestBed API

`submitItero`

| Argument     | Description | How to Obtain            |
| ------------ | ----------- | ------------------------ |
| `privateKey` | string      | https://itero.plasmo.com |
| `token`      | string      |                          |
| `userId`     | string      |                          |

Returns `Promise<true>` or throws an exception.

# Acknowledgements

This guide is a hard fork of [web-ext-deploy](https://github.com/avi12/web-ext-deploy) readme, adapted for [bms](https://github.com/PlasmoHQ/bms) and [bpp](https://github.com/PlasmoHQ/bpp).
