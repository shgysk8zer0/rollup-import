/* eslint-env node */
/* global process */
import MagicString from 'magic-string';
import { validateURL } from '@shgysk8zer0/npm-utils/url';

function transformSource(source, id, mapping) {
	const ms = new MagicString(source);

	Object.entries(mapping).forEach(([search, replace]) => ms.replaceAll(search, replace));

	if (ms.hasChanged()) {
		const code = ms.toString();
		const map = ms.generateMap({ source: id });

		return { code, map };
	}
}

export function rollupImportMeta({
	baseURL = process?.env?.URL,
	projectRoot = new URL(`${process.cwd()}/`, 'file://').href,
} = {}) {
	if (! validateURL(baseURL)) {
		throw new TypeError(`baseURL: "${baseURL}"" is not a valid URL.`);
	} else if (! validateURL(projectRoot)) {
		throw new TypeError(`projectRoot: "${projectRoot} is not a valid URL."`);
	} else {
		return {
			transform(source, id) {
				if (! source.includes('import.meta')) {
					return;
				} else if (id.startsWith('https:')) {
					return transformSource(source, id, {
						'${import.meta.url}': id,
						'import.meta.url': `'${id}'`,
						'import.meta.resolve(': `(path => new URL(path, '${id}').href)(`,
					});
				} else if (id.startsWith('file:')) {
					const url = new URL(id.replace(projectRoot, baseURL)).href;

					return transformSource(source, id, {
						'${import.meta.url}': url,
						'import.meta.url': `'${url}'`,
						'import.meta.resolve(': `(path => new URL(path, '${url}').href)(`,
					});
				}
			}
		};
	}
}
