/* eslint-env node */
import path from 'node:path';
import fs from 'node:fs';
import { parse } from 'yaml';

const URL_PREFIXES = ['http:', 'https:'];
const PATH_PREFIXES = ['/', './', '../'];
const YAML_EXTS = ['.yaml', '.yml'];
const JSON_EXTS = ['.json'];
const JS_MIMES = ['application/javascript', 'text/javascript'];

const isYAML = path => YAML_EXTS.some(ext => path.toLowerCase().endsWith(ext));
const isJSON = path => JSON_EXTS.some(ext => path.toLowerCase().endsWith(ext));
const isJS = type => JS_MIMES.includes(type.toLowerCase());
const isString = str => typeof str === 'string';
const isURL = str => isString(str) && URL_PREFIXES.some(scheme => str.startsWith(scheme));
const isPath = str => isString(str) && PATH_PREFIXES.some(scheme => str.startsWith(scheme));
const isBare = str => ! isPath(str) && ! isURL(str);

const cached = new Map();

const EXTERNAL_ERROR = 'Import specifier must NOT be present in the Rollup external config. Please remove specifier from the Rollup external config.';

function buildCache({ imports }, { external } = {}) {
	return Object.entries(imports).map(([key, value]) => {
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
}

function getFile(pathname = '', options = {}) {
	return new Promise((resolve, reject) => {
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
}

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
		async load(path) {
			if (cached.has(path)) {
				return cached.get(path);
			} else if (isPath(path)) {
				const content = await fs.promises.readFile(path, { encoding: 'utf8' });
				cached.set(path, content);
				return content;
			} else if (isURL(path)) {
				const resp = await fetch(path);
				if (resp.ok && isJS(resp.headers.get('Content-Type').split(';')[0].trim())) {
					const content = resp.text();
					cached.set(path, content);
					return content;
				} else {
					return null;
				}
			}
		},
		async buildStart(options) {
			if (typeof options !== 'undefined') {
				const mappings = maps.map(entry => isString(entry)
					? getFile(entry, options) // Load from file
					: buildCache(entry, options) // Build from object
				);

				await Promise.all(mappings).then(entries => {
					entries.forEach(entry => {
						entry.forEach(({ key, value }) => cache.set(key, value));
					});
				});
			}
		},
		resolveId(id, src, /*{ assertions, custom, isEntry }*/) {
			// @TODO: Store `options.external` and use for return value?
			if (isURL(src) && isPath(id)) {
				return { id: new URL(id, src).href, external: false };
			} else if (isBare(id)) {
				const match = getMatch(id);

				return isString(match) ? { id: match, external: false } : null;
			} else {
				return null;
			}
		},
	};
}
