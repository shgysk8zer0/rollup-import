# rolllup-import
A RollUp plugin for importing modules

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

## Example

### `rollup.config.js`

```js
import { rollupImport } from '@shgysk8zer0/rollup-import';

export default {
  input: 'test/index.js',
  plugins: [rollupImport(['importmap.json'])],
  external: ['externals'],
  output: {
    file: 'test/index.out.js',
    format: 'iife'
  }
};
```

### `importmap.json`

```json
{
  "imports": {
    "@scope/package": "https://unpkg.com/@scope/package@1.0.0/foo.js",
    "@scope/package/": "https://unpkg.com/@scope/package@1.0.0/"
  }
}
```

### `index.js`

```js
import { foo } from '@scope/package'; // -> https://unpkg.com/@scope/package@1.0.0/foo.js
import { bar } from '@scope/package/bar.js'; // -> https://unpkg.com/@scope/package@1.0.0/bar.js
```

## Notes
This currently only handles importmaps but has goals of also handling `import`
statements, and maybe `import.meta` handling.
