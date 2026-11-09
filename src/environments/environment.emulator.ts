// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Never commit a real key: a key shipped in the browser bundle is public anyway, so prefer a backend proxy.
  // Public web config (not a secret): access is enforced by the database rules.
  firebase: {
    apiKey: 'AIzaSyDK-byU9NpioO3Lve34_Y4QvxvOviDCKFY',
    authDomain: 'cseh-50966.firebaseapp.com',
    databaseURL: 'https://cseh-50966-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'cseh-50966',
    storageBucket: 'cseh-50966.appspot.com',
    messagingSenderId: '380057552327',
    appId: '1:380057552327:web:6f48c47bb21f44fd32c5e2'
  },
  // Firestore database created next to the legacy (Datastore mode) default one, see docs/firestore-model.md.
  firestoreDatabaseId: 'cse-db',
  emulators: {firestore: {host: '127.0.0.1', port: 8080}, auth: 'http://127.0.0.1:9099'},
  openAiApiKey: '',
  // Unsigned upload preset configured in the Cloudinary console (Settings > Upload).
  cloudinary: {cloudName: 'seo9axkp', uploadPreset: 'cse_unsigned'}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
