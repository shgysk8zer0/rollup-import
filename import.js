/* eslint-env node */
import { fileExists, readFile } from '@shgysk8zer0/npm-utils/fs';
import { readYAMLFile, isYAMLFile } from '@shgysk8zer0/npm-utils/yaml';
import { readJSONFile, isJSONFile } from '@shgysk8zer0/npm-utils/json';
import { buildImportmap, getInvalidMapError, resolveImport } from '@shgysk8zer0/npm-utils/importmap';
import { isString, isBare } from '@shgysk8zer0/npm-utils/utils';
import { JS as JS_MIMES } from '@shgysk8zer0/npm-utils/mimes';
import { pathToURL } from '@shgysk8zer0/npm-utils/url';

const isJS = type => JS_MIMES.includes(type.toLowerCase());

const cached = new Map();

async function getFile(pathname) {
	if (! await fileExists(pathname)) {
		throw new Error(`${pathname} not found.`);
	} else if (isYAMLFile(pathname)) {
		return readYAMLFile(pathname);
	} else if (isJSONFile(pathname)) {
		return readJSONFile(pathname);
	} else {
		throw new TypeError(`Unsupported file type for ${pathname}.`);
	}
}

export function rollupImport(importMaps = []) {
	const importmap = new Map();
	const maps = Array.isArray(importMaps) ? importMaps : [importMaps];

	return {
		name: '@shgysk8zer0/rollup-import',
		async load(path) {
			if (cached.has(path)) {
				return cached.get(path);
			} else {
				switch(new URL(path).protocol) {
					case 'file:':
						return readFile(path.replace('file://', '')).then(content => {
							cached.set(path, content);
							return content;
						});

					case 'https:':
					case 'http:':
						return fetch(path).then(async resp => {
							if (! resp.ok) {
								throw new Error(`<${path}> [${resp.status} ${resp.statusText}]`);
							} else if (! isJS(resp.headers.get('Content-Type').split(';')[0].trim())) {
								throw new TypeError(`Expected 'application/javascript' but got ${resp.headers.get('Content-Type')}`);
							} else {
								const content = await resp.text();
								cached.set(path, content);
								return content;
							}
						});

					default:
						throw new TypeError(`Unsupported protocol "${path}."`);
				}
			}
		},
		async buildStart(options) {
			if (typeof options !== 'undefined') {
				const mappings = maps.map(entry => isString(entry)
					? getFile(entry, options) // Load from file
					: entry // Use the Object
				);

				await buildImportmap(importmap, mappings);
				const err = getInvalidMapError(importmap);

				if (err instanceof Error) {
					throw err;
				}
			}
		},
		resolveId(id, src, { /*assertions, custom,*/ isEntry }) {
			// @TODO: Store `options.external` and use for return value?
			if (isEntry) {
				return { id: new URL(id, `file://${process.cwd()}/`).href, external: false };
			} else if (isBare(id)) {
				const match = resolveImport(id, importmap, { base: src });

				return match instanceof URL ? { id: match.href, external: false } : null;
			} else {
				return { id: pathToURL(id, src).href, external: false };
			}
		},
	};
}
