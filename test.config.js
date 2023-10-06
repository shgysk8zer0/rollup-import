import { rollupImport } from './import.js';
import { rollupImportMeta } from './meta.js';
import { getConfig } from '@shgysk8zer0/js-utils/rollup';

export default getConfig('./test/index.js', {
	format: 'cjs',
	plugins: [
		rollupImport(['importmap.yml']),
		rollupImportMeta({
			baseURL: 'https://example.com/',
		}),
	],
	minify: false,
	sourcemap: true,
});
