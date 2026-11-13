// Test data for the end-to-end tests: loads the fixtures into the Firestore emulator and creates the admin account
// in the Auth emulator. Never talks to production: both hosts come from the emulator environment variables.
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const PROJECT = 'cseh-50966';
const FIRESTORE = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';
const AUTH = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9099';
const OWNER = {Authorization: 'Bearer owner', 'Content-Type': 'application/json'};

// A super-administrator UID of firestore.rules: the rules of the emulator are the real ones.
export const ADMIN = {uid: 'OBWB7BXsEHPYmauZ6NqwEzcuc0x2', email: 'admin-test@example.com', password: 'Test-12345'};

async function send(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${url} -> ${response.status} ${await response.text()}`);
  }
}

export function assertEmulators() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error('FIRESTORE_EMULATOR_HOST is not set: run this through `npm run e2e` (firebase emulators:exec).');
  }
}

export async function resetFirestore() {
  await send(`http://${FIRESTORE}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, {method: 'DELETE'});
}

/** `a__b__c.json` holds the document `a/b/c`. */
export async function seedFirestore(directory) {
  for (const file of readdirSync(directory).filter(name => name.endsWith('.json'))) {
    const path = file.replace(/\.json$/, '').split('__').join('/');
    await send(`http://${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/${path}`,
      {method: 'PATCH', headers: OWNER, body: readFileSync(join(directory, file))});
  }
}

export async function createAdmin() {
  await send(`http://${AUTH}/emulator/v1/projects/${PROJECT}/accounts`, {method: 'DELETE'});
  const user = {localId: ADMIN.uid, email: ADMIN.email, emailVerified: true, rawPassword: ADMIN.password};
  await send(`http://${AUTH}/identitytoolkit.googleapis.com/v1/projects/${PROJECT}/accounts:batchCreate`,
    {method: 'POST', headers: OWNER, body: JSON.stringify({users: [user]})});
}
