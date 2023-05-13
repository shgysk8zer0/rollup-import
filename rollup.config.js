import { rollupImport } from './index.js';

export default {
	input: 'test/index.js',
	plugins: [rollupImport(['importmap.json'])],
	output: {
		file: 'test/index.out.js',
		format: 'iife'
	}
};
