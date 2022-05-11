# Tokens

This guide is a hard fork of [web-ext-deploy](https://github.com/avi12/web-ext-deploy) readme, adapted for [bms](https://github.com/PlasmoHQ/bms).

## Obtain the relevant cookie(s) of the publisher's account:

### Disclaimer: It is your responsibility for leaked cookies or credentials.

- Opera: `sessionid`, `csrftoken`

To obtain the cookie(s), you can run:

```shell
npx web-ext-deploy --get-cookies=opera
```

## Table of Contents

- [Chrome Web Store](#chrome-web-store-api)
- [Firefox Add-ons](#firefox-add-ons-api)
- [Edge Add-ons](#edge-add-ons-api)
- [Opera Add-ons](#opera-add-ons-api)

#### Chrome Web Store API

`deployChrome` object  
 Options:

- `extId` string  
  Get it from `https://chrome.google.com/webstore/detail/EXT_ID`, e.g. `https://chrome.google.com/webstore/detail/fcphghnknhkimeagdglkljinmpbagone`
- `refreshToken` string  
  The refresh token.
- `clientId` string  
  The client ID.
- `target` string
  The target to deploy to, either "default" or "trustedTesters". Defaults to "default".
- `zip` string  
  The relative path from the root to the ZIP.  
  You can use `{version}` to use the `version` entry from your `package.json`
- `verbose` boolean?  
  If `true`, it will be logged to the console when the uploading has begun.

To get your `refreshToken` and `clientId`, [follow this guide](https://github.com/PlasmoHQ/cwu/blob/main/token.md).

Returns `Promise<true>` or throws an exception.

#### Firefox Add-ons API

`deployFirefox` object  
 Options:

- `apiKey` string  
  Obtain it from: https://addons.mozilla.org/en-US/developers/addon/api/key/
- `apiSecret` string
  Obtain it from: https://addons.mozilla.org/en-US/developers/addon/api/key/

- `extId` string  
  This is the extension UUID, get it from https://addons.mozilla.org/en-US/developers/addon/{ext-name}/edit, under Technical Details. If it is embedded in your manifest under gecko.id, _omit this property_.

- `zip` string
  The relative path from the root to the ZIP.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`

- `verbose` boolean?  
  If `true`, every step of uploading to the Firefox Add-ons will be logged to the console.

Returns `Promise<true>` or throws an exception.

#### Edge Add-ons API

`deployEdge`
Options:

- `productId`:
  - "Product ID is required. To get it, create an edge add-on and go to the dashboard: https://partner.microsoft.com/en-us/dashboard/microsoftedge/{product-id}/package/dashboard",
- `clientId`:
  - "Client ID is required. To get one: https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi",
- `clientSecret`:
  - "Client Secret is required. To get one: https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi",
- `accessTokenUrl`:

  - "Access token URL is required. To get one: https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi"

- `zip`:
  - The relative path from the root to the ZIP.
    - You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`
- `notes` string?
  - Notes for certification, which will be visible to the Edge Add-ons reviewers.
- `verbose` boolean?
  - If `true`, every step of uploading to the Edge Add-ons will be logged to the console.

Returns `Promise<true>` or throws an exception.

**Note:**  
Due to the way the Edge dashboard works, when an extension is being reviewed or its review has just been canceled, it will take about a minute until a cancellation will cause its state to change from "In review" to "In draft", after which the new version can be submitted.  
Therefore, expect for longer wait times if you run the tool on an extension you had just published/canceled.

#### Opera Add-ons API

`deployOpera` object  
 Options:

- `packageId` number  
  The package ID of the extension from the store dashboard, e.g. `https://addons.opera.com/developer/package/PACKAGE_ID`
- `sessionid` string  
  The value of the cookie `sessionid`, which will be used to log in to the publisher's account.
- `csrftoken` string  
  The value of the cookie `csrftoken`, which will be used to upload the ZIP.
- `zip` string  
  The relative path from the root to the ZIP.  
  You can use `{version}` in the ZIP filename, which will be replaced by the `version` entry from your `package.json`
- `changelog` string?  
  The changes made in this version, compared to the previous one, which will be seen by the Opera users.  
  I recommend providing the changelog via `--opera-changelog`, so it stays up to date.
- `verbose` boolean?  
  If `true`, every step of uploading to the Opera Add-ons will be logged to the console.

If you have a hard time obtaining the values of the cookies `sessionid` and `csrftoken`, you can run:

```shell
web-ext-deploy --get-cookies=opera
```

Returns `Promise<true>` or throws an exception.

**Notes:**

- Source code inspection:  
  The Opera Add-ons reviewers require inspecting your extension's source code.  
  This can be done by doing **one** of the following:

  - Uploading the ZIP that contains the [source code](https://www.npmjs.com/package/zip-self) to a public folder on a storage service (e.g. [Google Drive](https://drive.google.com))
  - Making the extension's code open source on a platform like GitHub, with clear instructions on the `README.md`, and then linking to its repository.

  Note that you **do not** want to store the deployment script with your extension package, as the review team will have access to your precious cookies.

  If you'll open-source the extension on GitHub, you can exclude the deployment script by listing it in `.gitignore`
