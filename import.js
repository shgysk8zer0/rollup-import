/* eslint-env node */
import { fileExists, readFile } from '@shgysk8zer0/npm-utils/fs';
import { readYAMLFile, isYAMLFile } from '@shgysk8zer0/npm-utils/yaml';
import { readJSONFile, isJSONFile } from '@shgysk8zer0/npm-utils/json';
import { ROOT } from '@shgysk8zer0/npm-utils/consts';
import { buildImportmap, getInvalidMapError, resolveImport } from '@shgysk8zer0/npm-utils/importmap';
import { isString, isBare } from '@shgysk8zer0/npm-utils/utils';
import { pathToURL } from '@shgysk8zer0/npm-utils/url';
import { dirname } from '@shgysk8zer0/npm-utils/path';

const ESCAPE_PATTERN = /[\\'\n\r]/g;
const ESCAPES = {
	'\'': '\\\'',
	'\n': '\\n',
	'\r': '\\r',
	'\\': '\\\\'
};

const escapeStr = str => str.replaceAll(ESCAPE_PATTERN, c => ESCAPES[c]);

const TYPES = new Map([
	[undefined, 'application/javascript'],
	['json', 'application/json'],
	['css', 'text/css'],
	['bytes', '*/*'],
]);

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

function createExport(src, type) {
	if (typeof type !== 'string') {
		return src;
	} else {
		switch(type) {
			case 'json':
				return `export default JSON.parse('${escapeStr(src)}')`;

			case 'css':
				return `export default (c=>{const s=new CSSStyleSheet();s.replaceSync(c);return s;})('${escapeStr(src)}')`;

			case 'bytes':
				if (typeof src === 'string') {
					return `export default new Uint8Array([${new TextEncoder().encode(src).join(',')}])`;
				} else if (src instanceof Uint8Array) {
					return `export default new Uint8Array([${src.join(',')}]);`;
				} else {
					throw new TypeError('For byte exports, src must be a string or UInt8Array.');
				}

			default:
				throw new TypeError(`Unsupported type: ${type}.`);
		}
	}
}

export function rollupImport(importMaps = []) {
	const importmap = new Map();
	const maps = Array.isArray(importMaps) ? importMaps : [importMaps];
	const MAX_ATTEMPTS = 3;

	const fetchFile = async (path, {
		type,
		attempts = MAX_ATTEMPTS,
		referrerPolicy = 'no-referrer',
		cache = 'no-store',
		signal,
	} = {}) => {
		try {
			const accept = TYPES.has(type) ? TYPES.get(type) : 'application/javascript';
			const resp = await fetch(path, {
				headers: { Accept: accept },
				referrerPolicy,
				cache,
				signal,
			}).catch(() => Response.error());

			if (! resp.ok) {
				throw new Error(`<${path}> [${resp.status} ${resp.statusText}]`);
			} else if (type === 'bytes') {
				return createExport(await resp.bytes(), 'bytes');
			} else {
				return createExport(await resp.text(), type);
			}
		} catch(err) {
			if (attempts > 0) {
				console.warn(err);
				return await fetchFile(path, { attempts: --attempts, referrerPolicy, cache, signal });
			} else {
				throw err;
			}
		}
	};

	return {
		name: '@shgysk8zer0/rollup-import',
		async load(path) {
			if (cached.has(path)) {
				return cached.get(path);
			} else {
				const { assertions: { type } = {} } = this.getModuleInfo(path);
				switch(URL.parse(path)?.protocol) {
					case 'file:':
						return await (type === 'bytes'
							? readFile(path, { encoding: null }).then(buffer => createExport(buffer, 'bytes'))
							: readFile(path, { encoding: 'utf8' }).then(src => createExport(src, type))
						).then(result => {
							cached.set(path, result);
							return result;
						});

					case 'https:':
					case 'http:':
						return await fetchFile(path, { type, attempts: MAX_ATTEMPTS }).then(content => {
							cached.set(path, content);
							return content;
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
				return { id: new URL(id, ROOT.href).href, external: false };
			} else if (isBare(id)) {
				const match = resolveImport(id, importmap);

				if (match instanceof URL) {
					return { id: match.href, external: false };
				} else {
					return null;
				}
			} else {
				return { id: pathToURL(id, dirname(src)).href, external: false };
			}
		},
	};
}
