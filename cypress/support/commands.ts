declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Signs in with the test administrator of the Auth emulator from a clean visitor. */
      loginAsAdmin(): Chainable<void>;
      /** Visits a page as an anonymous visitor: Firebase keeps the sign-in in IndexedDB, which Cypress does not reset. */
      visitAsVisitor(url: string): Chainable<void>;
      /** Answers Cloudinary uploads with a fake URL, so a test never stores a real image. */
      stubCloudinary(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsAdmin', () => {
  // Always from a clean visitor: a session kept in IndexedDB would show the form for a moment before being recognised.
  cy.visitAsVisitor('/iWantToConfigureThisAwesomeApp');
  cy.get('input[type=email]').type(Cypress.env('adminEmail'));
  cy.get('input[type=password]').type(Cypress.env('adminPassword'), {log: false});
  cy.get('button[type=submit]').click();
  cy.contains('.login-status', Cypress.env('adminEmail'));
});

Cypress.Commands.add('visitAsVisitor', (url: string) => {
  cy.visit(url, {onBeforeLoad: window => void window.indexedDB.deleteDatabase('firebaseLocalStorageDb')});
});

Cypress.Commands.add('stubCloudinary', () => {
  cy.intercept('POST', 'https://api.cloudinary.com/**', {
    statusCode: 200,
    body: {secure_url: 'https://res.cloudinary.com/seo9axkp/image/upload/fake-test-cover'},
  }).as('cloudinaryUpload');
});

export {};
