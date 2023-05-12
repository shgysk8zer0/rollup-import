import { rollupImport } from './index.js';
import urlResolve from 'rollup-plugin-url-resolve';

export default {
	input: 'test/index.js',
	plugins: [rollupImport(['importmap.yaml']), urlResolve()],
	external: ['externals'],
	output: {
		file: 'test/index.out.js',
		format: 'iife'
	}
};
