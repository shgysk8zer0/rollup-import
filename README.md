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
- External [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
  - JSON
  - YAML
- Object `{ imports, scope }` for importmap
- Map `new Map([[specifier, value]])` for importmap
- Importing modules from URL and paths and "bare specifiers"
- Resolving `import.meta.url` and `import.meta.resolve('path.ext')`
- [Import Attributes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) (`import mod from 'specifier' with { type }`)
  - `'css'`
  - `'json'`
  - `'bytes'`

## Not yet supported
- `import html from 'template.html' with { type: 'html' }` - No spec yet and will have issues with TrustedTypes
- Parsing from `<script type="importmap">` in an HTML file
- Use of `scopes`

## Example

### `rollup.config.js`

```js
import {
  rollupImport, // Handles `import '@scope/package' resolving and fetching`
  rollupImportMeta // Handles `import.meta.url` and `import.meta.resolve()`,
} from '@shgysk8zer0/rollup-import';

import terser from '@rollup/plugin-terser';

// To load environment variables from `.env`
import { config } from 'dotenv';
config();

export default {
  input: 'src/index.mjs',
  plugins: [
    rollupImport(['path/to/importmap.json']),
    rollupImportMeta({
      // MUST be a valid URL
      baseURL: 'https://example.com', // Defaults to `process.env.URL` if set
      // MUST be a `file:` URL
      projectRoot: 'file:///home/user/Projects/my-project/', // Dfaults to `file:///${process.cwd()}/`
    }),
    terser(),
  ],
  output: {
    file: 'dest/index.js',
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
    "@scope/package": "./node_modules/@scope/package/index.js",
    "@shgysk8zer0/polyfills": "https://unpkg.com/@shgysk8zer0/polyfills@0.0.5/all.min.js",
    "@shgysk8zer0/polyfills/": "https://unpkg.com/@shgysk8zer0@0.0.5/polyfills/"
  }
}
```

### `index.js`

```js
import '@scope/package';
import { initializeApp } from 'firebase/firebase-app.js';
import data from '@scope/package/data.json' with { type: 'json' }; // Results of `JSON.parser()`
import sheet from '@scope/lib/style.css' with { type: 'css' }; // A `CSSStyleSheet`
import bytes from '@scope/lib/icon.png' with { type: 'bytes' }; // A `Uint8Array`
import { name } from './consts.js';

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = import.meta.resolve('styles.css');

document.head.append(stylesheet);
document.adoptedStyleSheets = [sheet];
document.title = data.title;

const img = document.createElement('img');
img.src = URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));
document.body.append(img);
img.decode().then(() => URL.revokeObjectURL(img.src));

```

## Notes

Using `import`s only, you may use only `rollupImport` or `rollupImportMeta`
via `@shgysk8zer0/rollup-import/import` and `@shgysk8zer0/rollup-import/meta`
respectively. To use with `require()`, you MUST import either/both using
`const {rollupImport, rollupImportMeta } = require('@shgysk8zer0/rollup-import')`.

This plugin works well if importing modules without bundling in the dev environment.
In order to do this, however, you **must** include a `<script type="importmap">`
in your HTML - `<script type="importmap" src="...">` will not work.
