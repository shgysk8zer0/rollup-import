import { rollupImport } from './import.js';
import { rollupImportMeta } from './meta.js';
import { config } from 'dotenv';
import { getConfig } from '@shgysk8zer0/js-utils/rollup';
config();

export default getConfig('./test/index.js', {
	format: 'cjs',
	plugins: [
		rollupImport(['importmap.json']),
		rollupImportMeta(),
	],
	minify: false,
	sourcemap: true,
});
