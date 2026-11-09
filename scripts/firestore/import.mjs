#!/usr/bin/env node
// Imports a Realtime Database JSON export into Firestore using the document model described in docs/firestore-model.md.
//
//   Emulator:   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/firestore/import.mjs --export db.json --project cseh-50966 --database cse-db
//   Production: GOOGLE_ACCESS_TOKEN=<OAuth token of a project owner> node scripts/firestore/import.mjs --export db.json --project cseh-50966 --database cse-db --prod
//
// Add --dry-run to only print the documents and their sizes.
import {readFileSync} from 'node:fs';
import {rewriteStorageUrls} from './storage-urls.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((arg, index, all) =>
  arg.startsWith('--') ? [arg.slice(2), all[index + 1]?.startsWith('--') || all[index + 1] === undefined ? true : all[index + 1]] : []).filter(entry => entry.length));
if (!args.export || !args.project || !args.database) {
  console.error('Usage: import.mjs --export <rtdb.json> --project <id> --database <id> [--prod] [--dry-run]');
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

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
const origin = emulatorHost ? `http://${emulatorHost}` : 'https://firestore.googleapis.com';
const databasePath = `projects/${args.project}/databases/${args.database}/documents`;
if (!emulatorHost && !process.env.GOOGLE_ACCESS_TOKEN) {
  console.error('Set GOOGLE_ACCESS_TOKEN for production.');
  process.exit(1);
}
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${emulatorHost ? 'owner' : process.env.GOOGLE_ACCESS_TOKEN}`,
  ...(emulatorHost ? {} : {'x-goog-user-project': args.project}),
};

// Converts plain JSON to the typed Firestore REST value format.
const toValue = value => {
  if (value === null || value === undefined) return {nullValue: null};
  if (typeof value === 'string') return {stringValue: value};
  if (typeof value === 'boolean') return {booleanValue: value};
  if (typeof value === 'number') return Number.isInteger(value) ? {integerValue: String(value)} : {doubleValue: value};
  if (Array.isArray(value)) return {arrayValue: {values: value.map(toValue)}};
  return {mapValue: {fields: Object.fromEntries(Object.entries(value).map(([key, child]) => [key, toValue(child)]))}};
};

const MAX_BATCH_BYTES = 4 * 1024 * 1024;
let batch = [];
let batchBytes = 0;
const flush = async () => {
  if (!batch.length) return;
  const response = await fetch(`${origin}/v1/${databasePath.replace(/\/documents$/, '')}/documents:commit`, {
    method: 'POST', headers, body: JSON.stringify({writes: batch}),
  });
  if (!response.ok) throw new Error(`commit failed ${response.status}: ${(await response.text()).slice(0, 400)}`);
  batch = [];
  batchBytes = 0;
};
for (const doc of documents) {
  if (batchBytes + doc.bytes > MAX_BATCH_BYTES || batch.length >= 400) await flush();
  batch.push({update: {name: `${databasePath}/${doc.path}`, fields: toValue(doc.data).mapValue.fields}});
  batchBytes += doc.bytes * 2;
}
await flush();
console.log('import done');
