import {defineConfig} from 'cypress';
import {ADMIN, assertEmulators, createAdmin, resetFirestore, seedFirestore} from './scripts/e2e/emulator-data.mjs';

const FIXTURES = 'cypress/fixtures/firestore';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4301',
    video: false,
    // The top bar is sticky: scrolling an element to the very top would hide it under the bar.
    scrollBehavior: 'center',
    // The emulators and the first Firestore listen are slower than the default 4 s allows.
    defaultCommandTimeout: 10000,
    viewportWidth: 1300,
    viewportHeight: 900,
    env: {adminEmail: ADMIN.email, adminPassword: ADMIN.password},
    setupNodeEvents(on) {
      on('task', {
        /** Puts the emulators back in the state of the fixtures: call it before a test that writes. */
        async resetData() {
          assertEmulators();
          await resetFirestore();
          await seedFirestore(FIXTURES);
          await createAdmin();
          return null;
        },
      });
    },
  },
});
