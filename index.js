/* eslint-env node */
import path from 'node:path';
import fs from 'node:fs';
import { parse } from 'yaml';

const PREFIXES = ['/', './', '../', 'http://', 'https://'];
const YAML_EXTS = ['.yaml', '.yml'];
const JSON_EXTS = ['.json'];

const isYAML = path => YAML_EXTS.some(ext => path.toLowerCase().endsWith(ext));
const isJSON = path => JSON_EXTS.some(ext => path.toLowerCase().endsWith(ext));
const isBare = str => ! PREFIXES.some(pre => str.startsWith(pre));
const isString = str => typeof str === 'string';

const EXTERNAL_ERROR = 'Import specifier must NOT be present in the Rollup external config. Please remove specifier from the Rollup external config.';

const buildCache = ({ imports }, { external } = {}) => Object.entries(imports).map(([key, value]) => {
	if (isBare(value)) {
		throw Error(`Import specifier can NOT be mapped to a bare import statement. Import specifier "${key}" is being wrongly mapped to "${value}"`);
	} else if (external instanceof Function && external(key)) {
		throw Error(EXTERNAL_ERROR);
	} else if (Array.isArray(external) && external.includes(key)) {
		throw Error(EXTERNAL_ERROR);
	} else {
		return { key, value };
	}
});

const getFile = (pathname = '', options = {}) => new Promise((resolve, reject) => {
	const filepath = path.normalize(pathname);
	fs.promises.readFile(filepath, { encoding: 'utf8' }).then(file => {
		try {
			if (isYAML(filepath)) {
				const obj = parse(file);
				resolve(buildCache(obj, options));
			} else if (isJSON(filepath)) {
				const obj = JSON.parse(file);
				resolve(buildCache(obj, options));
			} else {
				throw new Error('Unsupported file type.');
			}
		} catch (error) {
			reject(error);
		}
	}).catch(reject);
});

export function rollupImport(importMaps = []) {
	const cache = new Map();
	const maps = Array.isArray(importMaps) ? importMaps : [importMaps];

	function getMatch(id) {
		// Return exact matches first
		if (cache.has(id)) {
			return cache.get(id);
		} else {
			let isFound = false;

			// Find the longest value beginning with id
			// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap#mapping_path_prefixes
			const [key, value] = [...cache.entries()]
				.filter(([k]) => k.endsWith('/'))
				.reduce(([key1, value1], [key2, value2]) => {
					const matches = id.startsWith(key2);

					if (! isFound && matches) {
						isFound = true;
						return [key2, value2];
					} else if (matches && key2.length > key1.length) {
						return [key2, value2];
					} else {
						return [key1, value1];
					}
				}, []);

			if (typeof key === 'string') {
				const match = id.replace(key, value);
				// Update cache for future searches
				cache.set(id, match);
				return match;
			} else {
				return null;
			}
		}
	}

	return {
		name: '@shgysk8zer0/rollup-import',
		// @TODO: Add `load()`
		async buildStart(options) {
			const mappings = maps.map(entry => isString(entry)
				? getFile(entry, options) // Load from file
				: buildCache(entry, options) // Build from object
			);

			await Promise.all(mappings).then(entries => {
				entries.forEach(entry => {
					entry.forEach(({ key, value }) => cache.set(key, value));
				});
			});
		},
		resolveId(id/*, src, { assertions, custom, isEntry }*/) {
			// @TODO: Store `options.external` and use for return value?
			if (! isBare(id)) {
				return null;
			} else {
				const match = getMatch(id);

				return typeof match === 'string'
					? { id: match, external: false }
					: null;
			}
		},
	};
}
