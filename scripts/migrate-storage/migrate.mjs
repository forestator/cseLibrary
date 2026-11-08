#!/usr/bin/env node
// One-shot migration of Firebase Storage files to Cloudinary.
//
//   node scripts/migrate-storage/migrate.mjs copy      --cloud <name> --preset <unsigned preset> [--dry-run]
//   node scripts/migrate-storage/migrate.mjs rewrite-src --cloud <name>
//   node scripts/migrate-storage/migrate.mjs rewrite-db  --cloud <name> --db <export.json>
//
// Cloudinary public ids mirror the old storage path without its extension, so URLs are deterministic
// and the book cover pipes can build them without a database lookup.
import {readFile, writeFile, readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

const BUCKET = 'cseh-50966.appspot.com';
const API = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;
const OUT_DIR = path.dirname(new URL(import.meta.url).pathname);
const STATE_FILE = path.join(OUT_DIR, 'copied.json');
const OLD_URL = /https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/cseh-50966\.appspot\.com\/o\/([^"'\\\s?)]+)(?:\?[^"'\\\s)]*)?/g;

const [command, ...rest] = process.argv.slice(2);
const args = Object.fromEntries(rest.filter(arg => arg.startsWith('--'))
  .map((arg, index, all) => [arg.slice(2), rest[rest.indexOf(arg) + 1]?.startsWith('--') ? true : rest[rest.indexOf(arg) + 1] ?? true]));
const cloud = args.cloud;
if (!command || !cloud) {
  console.error('Missing command or --cloud. See header of this file.');
  process.exit(1);
}

const publicIdOf = storagePath => storagePath.replace(/\.[^./]+$/, '');
const newUrl = storagePath => `https://res.cloudinary.com/${cloud}/image/upload/${encodeURI(publicIdOf(storagePath))}`;
const replaceUrls = text => text.replace(OLD_URL, (_, encodedPath) => newUrl(decodeURIComponent(encodedPath)));

async function listAll() {
  const names = [];
  let pageToken = '';
  do {
    const response = await fetch(`${API}?maxResults=1000${pageToken ? `&pageToken=${pageToken}` : ''}`);
    if (!response.ok) throw new Error(`List failed: ${response.status} ${await response.text()}`);
    const body = await response.json();
    names.push(...(body.items ?? []).map(item => item.name));
    pageToken = body.nextPageToken ?? '';
  } while (pageToken);
  return names;
}

async function copy() {
  const state = existsSync(STATE_FILE) ? JSON.parse(await readFile(STATE_FILE, 'utf8')) : {};
  const names = (await listAll()).filter(name => !name.endsWith('/'));
  console.log(`${names.length} files in bucket, ${Object.keys(state).length} already copied`);
  if (args['dry-run']) {
    names.forEach(name => console.log(name));
    return;
  }
  const failures = [];
  const queue = names.filter(name => !state[name]);
  const worker = async () => {
    for (let name = queue.shift(); name; name = queue.shift()) {
      try {
        const download = await fetch(`${API}/${encodeURIComponent(name)}?alt=media`);
        if (!download.ok) throw new Error(`download ${download.status}`);
        const body = new FormData();
        body.append('file', new Blob([await download.arrayBuffer()], {type: download.headers.get('content-type') ?? 'application/octet-stream'}), path.basename(name));
        body.append('upload_preset', args.preset);
        body.append('public_id', publicIdOf(name));
        const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {method: 'POST', body});
        if (!upload.ok) throw new Error(`upload ${upload.status} ${await upload.text()}`);
        state[name] = (await upload.json()).secure_url;
        await writeFile(STATE_FILE, JSON.stringify(state, null, 2));
        console.log('ok  ', name);
      } catch (error) {
        failures.push(name);
        console.error('FAIL', name, error.message);
      }
    }
  };
  await Promise.all(Array.from({length: 4}, worker));
  console.log(`done, ${failures.length} failure(s)`);
  if (failures.length) process.exitCode = 2;
}

async function walk(dir) {
  const entries = await readdir(dir, {withFileTypes: true});
  const files = await Promise.all(entries.map(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  }));
  return files.flat();
}

async function rewriteSrc() {
  const root = path.resolve(OUT_DIR, '../../src');
  let changed = 0;
  for (const file of (await walk(root)).filter(file => /\.(html|ts|scss)$/.test(file))) {
    const text = await readFile(file, 'utf8');
    const fixed = replaceUrls(text);
    if (fixed !== text) {
      await writeFile(file, fixed);
      console.log('rewritten', path.relative(root, file));
      changed++;
    }
  }
  console.log(`${changed} file(s) changed`);
}

// Produces updates.json: {"a/b/c": newValue} to apply with `firebase database:update / updates.json`.
async function rewriteDb() {
  const original = JSON.parse(await readFile(args.db, 'utf8'));
  const updates = {};
  const visit = (node, trail) => {
    if (typeof node === 'string') {
      const fixed = replaceUrls(node);
      if (fixed !== node) updates[trail.join('/')] = fixed;
    } else if (node && typeof node === 'object') {
      Object.entries(node).forEach(([key, child]) => visit(child, [...trail, key]));
    }
  };
  visit(original, []);
  await writeFile(path.join(OUT_DIR, 'updates.json'), JSON.stringify(updates, null, 2));
  console.log(`${Object.keys(updates).length} value(s) to update -> scripts/migrate-storage/updates.json`);
}

await {copy, 'rewrite-src': rewriteSrc, 'rewrite-db': rewriteDb}[command]?.();
