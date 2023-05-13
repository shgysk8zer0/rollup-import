# rolllup-import
A RollUp plugin for importing modules from URLs, paths, and "bare specifiers" using
import maps. You'll no longer need to `npm i` everything you need in front-end code.

- - -
[![CodeQL](https://github.com/shgysk8zer0/rollup-import/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shgysk8zer0/rollup-import/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/shgysk8zer0/rollup-import/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/shgysk8zer0/rollup-import/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/shgysk8zer0/rollup-import.svg)](https://github.com/shgysk8zer0/rollup-import/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/shgysk8zer0/rollup-import.svg)](https://github.com/shgysk8zer0/rollup-import/commits/master)
[![GitHub release](https://img.shields.io/github/release/shgysk8zer0/rollup-import?logo=github)](https://github.com/shgysk8zer0/rollup-import/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@shgysk8zer0/rollup-import)](https://www.npmjs.com/package/@shgysk8zer0/rollup-import)
![node-current](https://img.shields.io/node/v/@shgysk8zer0/rollup-import)
![npm bundle size gzipped](https://img.shields.io/bundlephobia/minzip/@shgysk8zer0/rollup-import)
[![npm](https://img.shields.io/npm/dw/@shgysk8zer0/rollup-import?logo=npm)](https://www.npmjs.com/package/@shgysk8zer0/rollup-import)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/shgysk8zer0/rollup-import.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/shgysk8zer0/rollup-import.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->

## Installation

```bash
npm i @shgysk8zer0/rollup-import
```

## Supports
- External [impormap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)s
  - JSON
  - YAML
- Importing modules from URL and paths and "bare specifiers"

## Example

### `rollup.config.js`

```js
import { rollupImport } from '@shgysk8zer0/rollup-import';

export default {
  input: 'src/index.js',
  plugins: [rollupImport(['importmap.json'])],
  output: {
    file: 'dest/index.out.js',
    format: 'iife'
  }
};
```

### `importmap.json`

```json
{
  "imports": {
    "leaflet": "https://unpkg.com/leaflet@1.9.3/dist/leaflet-src.esm.js",
    "firebase/": "https://www.gstatic.com/firebasejs/9.16.0/",
    "@scope/package": "./node_modules/@scope/package/index.js"
    "@shgysk8zer0/polyfills": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.5/all.min.js",
    "@shgysk8zer0/polyfills/": "https://unpkg.com/@shgysk8zer0@0.0.5/polyfills/"
  }
}
```

### `index.js`

```js
import '@scope/package';
import '@shgysk8zer0/polyfills';
import '@shgysk8zer0/polyfills/legacy/object.js'; // -> "https://unpkg.com/@shgysk8zer0@0.0.5/polyfills/legacy/ojbect.js"
import { name } from './consts.js';

import {
  map as LeafletMap,
  marker as LeafletMarker,
  icon as LeafletIcon,
  tileLayer as LeafletTileLayer,
  point as Point,
  latLng as LatLng,
  version,
} from 'leaflet';

import { initializeApp } from 'firebase/firebase-app.js';

import {
  getFirestore, collection, getDocs, getDoc, doc, addDoc, setDoc,
  enableIndexedDbPersistence,
} from 'firebase/firebase-firestore.js';

import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  onAuthStateChanged, updateProfile, sendPasswordResetEmail,
} from 'firebase/firebase-auth.js';

import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/firebase-storage.js';
```

## Note
This plugin works well if importing modules without bundling in the dev environment.
In order to do this, however, you **must** include a `<script type="importmap">`
in your HTML - `<script type="importmap" src="...">` will not work.

Eventually, this may also replace `import.meta.url` with the current URL if possible.
