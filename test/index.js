import 'mod';
import '@shgysk8zer0/polyfills';
import '@shgysk8zer0/polyfills/legacy/array.js';
import '@shgysk8zer0/polyfills/legacy/object.js';
import '@shgysk8zer0/polyfills/legacy/element.js';
import { html, ready } from '@shgysk8zer0/kazoo/dom.js';

ready().then(() => {
	html('body', '<h1>Hello, World</h1>');
});
