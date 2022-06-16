# Tokens

- [Chrome Web Store](#chrome-web-store-api)
- [Firefox Add-ons](#firefox-add-ons-api)
- [Edge Add-ons](#edge-add-ons-api)
- [Opera Add-ons](#opera-add-ons-api)

## Chrome Web Store API

`submitChrome`

| Argument       | Description | How to Obtain                                                                                                                                     |
| -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `extId`        | string      | Get it from `https://chrome.google.com/webstore/detail/EXT_ID`, e.g. `https://chrome.google.com/webstore/detail/fcphghnknhkimeagdglkljinmpbagone` |
| `refreshToken` | string      | [Guide](https://github.com/PlasmoHQ/chrome-webstore-api/blob/main/token.md)                                                                       |
| `clientId`     | string      | [Guide (same as refreshToken)](https://github.com/PlasmoHQ/chrome-webstore-api/blob/main/token.md)                                                |
| `clientSecret` | string      | [Guide (same as refreshToken)](https://github.com/PlasmoHQ/chrome-webstore-api/blob/main/token.md)                                                |
| `target`       | string      | The target to deploy to, either "default" or "trustedTesters". Defaults to "default".                                                             |
| `zip`          | string      | The relative path from the root to the ZIP. You can use `{version}` to use the `version` entry from your `package.json`                           |
| `verbose`      | boolean?    | Enable verbose logging                                                                                                                            |

Returns `Promise<true>` or throws an exception on failure.

## Firefox Add-ons API

`submitFirefox`

| Argument    | Description | How to Obtain                                                                                                                                                                                                |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apiKey`    | string      | https://addons.mozilla.org/en-US/developers/addon/api/key/                                                                                                                                                   |
| `apiSecret` | string      | https://addons.mozilla.org/en-US/developers/addon/api/key/                                                                                                                                                   |
| `extId`     | string      | This is the extension UUID, get it from https://addons.mozilla.org/en-US/developers/addon/{ext-name}/edit, under Technical Details. If it is embedded in your manifest under gecko.id, _omit this property_. |
| `zip`       | string      | The relative path from the root to the ZIP. You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`                                              |
| `verbose`   | boolean?    | If `true`, every step of uploading to the Firefox Add-ons will be logged to the console.                                                                                                                     |

Returns `Promise<true>` or throws an exception.

## Edge Add-ons API

`submitEdge`

| Argument         | Description | How to Obtain                                                                                                                                                   |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `productId`      | string      | Create an edge add-on and go to the dashboard: `https://partner.microsoft.com/en-us/dashboard/microsoftedge/{product-id}/package/dashboard`                     |
| `clientId`       | string      | https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi                                                                                          |
| `clientSecret`   | string      | https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi                                                                                          |
| `accessTokenUrl` | string      | https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi                                                                                          |
| `zip`            | string      | The relative path from the root to the ZIP. You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json` |
| `verbose`        | boolean?    | If `true`, every step of uploading to the Firefox Add-ons will be logged to the console.                                                                        |
| `note`           | string?     | Notes for certification, which will be visible to the Edge Add-ons reviewers                                                                                    |

Returns `Promise<true>` or throws an exception.

> **Note:**
>
> Due to the way the Edge dashboard works, when an extension is being reviewed or its review has just been canceled, it will take about a minute until a cancellation will cause its state to change from "In review" to "In draft", after which the new version can be submitted.
>
> Therefore, expect for longer wait times if you run the tool on an extension you had just published/canceled.

## Opera Add-ons API

`submitOpera`

| Argument    | Description | How to Obtain                                                                                                                                                   |
| ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packageId` | string      | `https://addons.opera.com/developer/package/PACKAGE_ID`                                                                                                         |
| `sessionid` | string      | web-ext-deploy --get-cookies=opera                                                                                                                              |
| `csrftoken` | string      | web-ext-deploy --get-cookies=opera                                                                                                                              |
| `zip`       | string      | The relative path from the root to the ZIP. You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json` |
| `verbose`   | boolean?    | If `true`, every step of uploading to the Firefox Add-ons will be logged to the console.                                                                        |
| `changelog` | string?     | The changes made in this version, compared to the previous one, which will be seen by the Opera users.                                                          |

Returns `Promise<true>` or throws an exception.

> **Notes:**
>
> - Source code inspection:  
>   The Opera Add-ons reviewers require inspecting your extension's source code.  
>   This can be done by doing **one** of the following:
>
> - Uploading the ZIP that contains the [source code](https://www.npmjs.com/package/zip-self) to a public folder on a storage service (e.g. [Google Drive](https://drive.google.com))
> - Making the extension's code open source on a platform like GitHub, with clear instructions on the `README.md`, and then linking to its repository.
>
> You **do not** want to store the deployment script with your extension package, as the review team will have access to your precious cookies.
>
> If you'll open-source the extension on GitHub, you can exclude the deployment script by listing it in `.gitignore`

# Acknowledgements

This guide is a hard fork of [web-ext-deploy](https://github.com/avi12/web-ext-deploy) readme, adapted for [bms](https://github.com/PlasmoHQ/bms) and [bpp](https://github.com/PlasmoHQ/bpp).
