import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {connectFirestoreEmulator, getFirestore, initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {getAnalytics, provideAnalytics, ScreenTrackingService} from '@angular/fire/analytics';
import {environment} from '../environments/environment';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      // Against the emulators (end-to-end tests) Firestore uses plain long polling: the Cypress proxy holds back the
      // streamed responses of the default transport, and big reads then never complete.
      const firestore = environment.emulators
        ? initializeFirestore(getApp(), {experimentalForceLongPolling: true}, environment.firestoreDatabaseId)
        : getFirestore(getApp(), environment.firestoreDatabaseId);
      if (environment.emulators) {
        connectFirestoreEmulator(firestore, environment.emulators.firestore.host, environment.emulators.firestore.port);
      }
      return firestore;
    }),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.emulators) {
        connectAuthEmulator(auth, environment.emulators.auth, {disableWarnings: true});
      }
      return auth;
    }),
    ...(environment.emulators ? [] : [provideAnalytics(() => getAnalytics()), ScreenTrackingService]),
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
  ],
};
