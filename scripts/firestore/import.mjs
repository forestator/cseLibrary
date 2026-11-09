#!/usr/bin/env node
// Imports a Realtime Database JSON export into Firestore using the document model described in docs/firestore-model.md.
//
//   Emulator: FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/firestore/import.mjs --export db.json --project cseh-50966
//   Production: node scripts/firestore/import.mjs --export db.json --project cseh-50966 --prod   (needs Application Default Credentials)
//
// Add --dry-run to only print the documents and their sizes.
import {readFileSync} from 'node:fs';
import {initializeApp, applicationDefault} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {rewriteStorageUrls} from './storage-urls.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((arg, index, all) =>
  arg.startsWith('--') ? [arg.slice(2), all[index + 1]?.startsWith('--') || all[index + 1] === undefined ? true : all[index + 1]] : []).filter(entry => entry.length));
if (!args.export || !args.project) {
  console.error('Usage: import.mjs --export <rtdb.json> --project <id> [--prod] [--dry-run]');
  process.exit(1);
}
if (!process.env.FIRESTORE_EMULATOR_HOST && !args.prod && !args['dry-run']) {
  console.error('Refusing to write to production without --prod (or set FIRESTORE_EMULATOR_HOST).');
  process.exit(1);
}

const MAX_DOC_BYTES = 900 * 1024;
// Order of the RTDB `bibliotheque` array; ids are the route ids used by the app.
const LIBRARY_IDS = ['litterature-imaginaire', 'inclassable', 'litterature-jeunesse', 'litterature-adulte'];

const rtdb = JSON.parse(rewriteStorageUrls(readFileSync(args.export, 'utf8')));
const documents = [];
let droppedNulls = 0;

// RTDB turns sparse arrays into null holes; Firestore rejects undefined and keeps nulls, so holes are dropped.
const clean = value => {
  if (Array.isArray(value)) {
    return value.filter(item => {
      if (item === null) droppedNulls++;
      return item !== null;
    }).map(clean);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([, child]) => child !== null).map(([key, child]) => [key, clean(child)]));
  }
  return value;
};

const add = (path, data) => documents.push({path, data: clean(data)});

for (const library of ['boardGames', 'videoGames', 'outsideGames']) {
  add(`ludotheque/${library}`, rtdb.ludotheque[library]);
}
for (const commission of ['bricolage', 'sonotheque', 'nautisme', 'photo']) {
  add(`commissions/${commission}`, rtdb[commission]);
}
rtdb.bibliotheque.forEach((entry, index) => {
  if (!entry) return;
  const libraryId = LIBRARY_IDS[index];
  const {categories = [], ...libraryInfo} = entry.library;
  add(`bibliotheque/${libraryId}`, {
    library: {...libraryInfo, categoryIds: categories.map(category => category.id)},
    authors: entry.authors ?? [],
    publishers: entry.publishers ?? [],
  });
  categories.forEach(category => add(`bibliotheque/${libraryId}/categories/${category.id}`, category));
});
(rtdb.users ?? []).filter(Boolean).forEach(user => add(`users/${user.id}`, user));

let tooBig = 0;
for (const doc of documents) {
  const bytes = Buffer.byteLength(JSON.stringify(doc.data));
  doc.bytes = bytes;
  if (bytes > MAX_DOC_BYTES) {
    tooBig++;
    console.error(`TOO BIG ${doc.path}: ${Math.round(bytes / 1024)} KB`);
  }
}
console.log(`${documents.length} documents, largest ${Math.round(Math.max(...documents.map(doc => doc.bytes)) / 1024)} KB, ${droppedNulls} null hole(s) dropped, ${tooBig} too big`);
if (tooBig) process.exit(2);

if (args['dry-run']) {
  documents.filter(doc => !doc.path.startsWith('users/')).forEach(doc => console.log(`${doc.path.padEnd(70)} ${Math.round(doc.bytes / 1024)} KB`));
  process.exit(0);
}

initializeApp({projectId: args.project, ...(process.env.FIRESTORE_EMULATOR_HOST ? {} : {credential: applicationDefault()})});
const firestore = getFirestore();
for (let start = 0; start < documents.length; start += 400) {
  const batch = firestore.batch();
  documents.slice(start, start + 400).forEach(doc => batch.set(firestore.doc(doc.path), doc.data));
  await batch.commit();
}
console.log('import done');
