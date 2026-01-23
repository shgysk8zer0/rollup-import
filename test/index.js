import '@shgysk8zer0/polyfills';
import bytes from 'https://cdn.kernvalley.us/img/octicons/bell.svg' with { type: 'bytes' };
import data from './data.json' with { type: 'json' };
import sheet from './style.css' with { type: 'css' };
import { html, ready } from '@shgysk8zer0/kazoo/dom.js';
import './components.js';

import {
	map as LeafletMap,
	marker as LeafletMarker,
	icon as LeafletIcon,
	tileLayer as LeafletTileLayer,
	point as Point,
	latLng as LatLng,
	version,
} from 'leaflet';

import { initializeApp } from 'firebase/firebase-app.js';

import {
	getFirestore, collection, getDocs, getDoc, doc, addDoc, setDoc,
	enableIndexedDbPersistence,
} from 'firebase/firebase-firestore.js';

import {
	getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
	onAuthStateChanged, updateProfile, sendPasswordResetEmail,
} from 'firebase/firebase-auth.js';

import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/firebase-storage.js';

console.log({
	LeafletMap, LeafletMarker, LeafletIcon, LeafletTileLayer, Point, LatLng, version,
	initializeApp, getFirestore, collection, getDocs, getDoc, doc, addDoc, setDoc,
	enableIndexedDbPersistence, getAuth, createUserWithEmailAndPassword,
	signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile,
	sendPasswordResetEmail, getStorage, ref, getDownloadURL, uploadBytes,
	metaURL: import.meta.url, metaResolve: import.meta.resolve('../index.js'),
});

document.adoptedStyleSheets = [sheet];
ready().then(() => {
	html('body', `<h1>Hello, ${data.name}</h1>`);
	const img = document.createElement('img');
	const blob = new Blob([bytes], { type: 'image/svg+xml' });
	console.log(blob);
	img.src = URL.createObjectURL(blob);
	document.body.append(img);
	blob.text().then(console.log);
	img.decode().then(() => URL.revokeObjectURL(img.src));
	console.log(import.meta.url);
	console.log(import.meta.resolve('index.html'));
});
