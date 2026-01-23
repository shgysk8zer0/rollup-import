import { rollupImport } from './import.js';
import { rollupImportMeta } from './meta.js';
import { getConfig } from '@shgysk8zer0/js-utils/rollup';

export default getConfig('./test/index.js', {
	format: 'iife',
	plugins: [
		rollupImport(['importmap.yml']),
		rollupImportMeta({
			baseURL: 'https://example.com/',
		}),
	],
	minify: true,
	sourcemap: true,
});
