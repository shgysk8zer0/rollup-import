import { rollupImport } from './index.js';

export default {
	input: 'test/index.js',
	onwarn: warning => {
		if (warning.code === 'MISSING_GLOBAL_NAME' || warning.code === 'UNRESOLVED_IMPORT') {
			throw new Error(warning.message);
		} else if (warning.code !== 'CIRCULAR_DEPENDENCY') {
			console.warn(`(!) ${warning.message}`);
		}
	},
	plugins: [rollupImport(['importmap.json'])],
	output: {
		file: 'test/index.out.js',
		format: 'iife'
	}
};
