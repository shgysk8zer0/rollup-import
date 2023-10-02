import { getConfig } from '@shgysk8zer0/js-utils/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default getConfig('./index.js', {
	format: 'cjs',
	minify: false,
	sourcemap: false,
	plugins: [nodeResolve()],
	external: [
		'@shgysk8zer0/npm-utils/importmap', '@shgysk8zer0/npm-utils/fs',
		'@shgysk8zer0/npm-utils/yaml', '@shgysk8zer0/npm-utils/json',
		'@shgysk8zer0/npm-utils/utils', '@shgysk8zer0/consts/exts',
		'@shgysk8zer0/consts/mimes', '@shgysk8zer0/npm-utils/consts',
		'@shgysk8zer0/npm-utils/url', 'node:fs', 'js-yaml', 'magic-string',
	],
});
