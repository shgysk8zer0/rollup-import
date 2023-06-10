import { getConfig } from '@shgysk8zer0/js-utils/rollup';

export default getConfig('./index.js', {
	format: 'cjs',
	minify: false,
	sourcemap: false,
	external: [
		'@shgysk8zer0/npm-utils/importmap', '@shgysk8zer0/npm-utils/fs',
		'@shgysk8zer0/npm-utils/yaml', '@shgysk8zer0/npm-utils/json',
		'@shgysk8zer0/npm-utils/utils', '@shgysk8zer0/npm-utils/exts',
		'@shgysk8zer0/npm-utils/mimes', '@shgysk8zer0/npm-utils/consts',
		'@shgysk8zer0/npm-utils/url', 'node:fs', 'js-yaml', 'magic-string',
	],
});
