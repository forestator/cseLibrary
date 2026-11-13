// Runs the Cypress suite against the emulators: serves the app in emulator mode, loads the test data, runs Cypress.
// Started by `npm run e2e`, inside `firebase emulators:exec` (which provides the emulators and their environment).
import {spawn} from 'node:child_process';
import {assertEmulators, createAdmin, resetFirestore, seedFirestore} from './emulator-data.mjs';

const PORT = 4301;
const URL = `http://localhost:${PORT}`;
const FIXTURES = 'cypress/fixtures/firestore';

assertEmulators();

async function waitFor(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) {
        return;
      }
    } catch {
      // not up yet
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error(`${url} did not answer within ${timeoutMs / 1000} s`);
}

const alreadyServed = await fetch(URL).then(() => true, () => false);
if (alreadyServed) {
  throw new Error(`${URL} already answers: stop the server running on port ${PORT} first, it may not use the emulators.`);
}

// Own process group: killing only `npx` would leave `ng serve` running on the port.
const server = spawn('npx', ['ng', 'serve', '--configuration', 'emulator', '--port', String(PORT)], {stdio: 'ignore', detached: true});
let code = 1;
try {
  await waitFor(URL, 240_000);
  await resetFirestore();
  await seedFirestore(FIXTURES);
  await createAdmin();
  const cypress = spawn('npx', ['cypress', 'run', ...process.argv.slice(2)], {stdio: 'inherit'});
  code = await new Promise(resolve => cypress.on('exit', exitCode => resolve(exitCode ?? 1)));
} finally {
  process.kill(-server.pid);
}
process.exit(code);
