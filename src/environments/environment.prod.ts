export const environment = {
  production: true,
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
  firestoreDatabaseId: '(default)',
  emulators: undefined as undefined | {firestore: {host: string; port: number}; auth: string},
  openAiApiKey: '',
  // Unsigned upload preset configured in the Cloudinary console (Settings > Upload).
  cloudinary: {cloudName: 'seo9axkp', uploadPreset: 'cse_unsigned'}
};
