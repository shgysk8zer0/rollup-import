import 'polyfills';
import { html, ready } from 'dom';

ready().then(() => {
	html('body', '<h1>Hello, World</h1>');
});
