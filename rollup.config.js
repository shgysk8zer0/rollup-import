export default {
	input: 'index.js',
	external: [
		'@shgysk8zer0/npm-utils/importmap', '@shgysk8zer0/npm-utils/fs',
		'@shgysk8zer0/npm-utils/yaml', '@shgysk8zer0/npm-utils/json',
		'@shgysk8zer0/npm-utils/utils', '@shgysk8zer0/npm-utils/exts',
		'@shgysk8zer0/npm-utils/mimes', '@shgysk8zer0/npm-utils/conts',
		'@shgysk8zer0/npm-utils/url', 'node:fs', 'js-yaml',
	],
	onwarn: warning => {
		if (warning.code === 'MISSING_GLOBAL_NAME' || warning.code === 'UNRESOLVED_IMPORT') {
			throw new Error(warning.message);
		} else if (warning.code !== 'CIRCULAR_DEPENDENCY') {
			console.warn(`(!) ${warning.message}`);
		}
	},
	output: {
		file: 'index.cjs',
		format: 'cjs'
	}
};
