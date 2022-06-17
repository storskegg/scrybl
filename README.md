# scrybl [![Known Vulnerabilities](https://snyk.io/test/github/storskegg/scrybl/badge.svg?targetFile=package.json)](https://snyk.io/test/github/storskegg/scrybl?targetFile=package.json)

Browser console override implementing Beacon API to push logging to a known endpoint.

## Installing

`npm install --save scrybl`

## Upgrading to v2

This is really the first time I've touched this repo in 4 years.

### Breaking Changes

There are a couple breaking changes made to this repo in v2 from "v0."

1. I've updated the repo and code with inclusive language.
   1. Primary branch has been renamed from `master` to `main`.
   2. The instantiation parameter `whitelist` has been renamed to `allowList`
2. The original class name was a typo, and has been renamed from `Scryb` to `Scrybl` to match the repo.

### Nonbreaking Changes

#### New Instantiation Parameter -- `disabled`

Release cycles between clients and endpoints don't always jive, and sometimes you need to release code in a client ahead of the backend. Alternatively, there may be a staged rollout of a new production feature, enabling a feature for X number of users based on certain criteria.

Set `disabled` to true to effectively NOOP this library, and the console object will remain untouched.

#### Safely Call Beacon API

Before, this library optimistically called the Beacon API. This would obviously throw an error in the event that `navigator` isn't a global, or `sendBeacon` isn't a method on the `navigator` global. Instantiation now bails if the Beacon API doesn't exist, as though the library were called with `disabled` set to true.

#### `silentMode` Respected by NOOP

Previously, silent mode wasn't respected when a NOOP'd function was called. This has been fixed.

#### `log` Always Available

`console.log` will now always be made available in its underscore form regardless of allowlist.
