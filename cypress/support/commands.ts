import type {AxeResults, ElementContext, RunOptions} from 'axe-core';

interface PageWithAxe extends Window {
  eval(code: string): unknown;
  axe: {run(context: ElementContext, options: RunOptions): Promise<AxeResults>};
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Signs in with the test administrator of the Auth emulator from a clean visitor. */
      loginAsAdmin(): Chainable<void>;
      /** Visits a page as an anonymous visitor: Firebase keeps the sign-in in IndexedDB, which Cypress does not reset. */
      visitAsVisitor(url: string): Chainable<void>;
      /** The form field (inside the open dialog) whose label is `label`. */
      formField(label: string): Chainable<JQuery<HTMLElement>>;
      /** Replaces the content of a form field. Forced: a Material label floats over the input and would "cover" it. */
      fillField(label: string, text: string): Chainable<void>;
      /** Clicks Enregistrer in the open dialog. */
      saveForm(): Chainable<void>;
      /** Fails with the list of accessibility violations (axe, WCAG A and AA) of `selector`, or of the whole page. */
      checkA11y(selector?: string): Chainable<void>;
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

Cypress.Commands.add('formField', (label: string) =>
  cy.get('.mat-mdc-dialog-container mat-form-field').filter((_, element) =>
    element.querySelector('mat-label')?.textContent?.replace(/[\s*]+$/, '').trim() === label));

Cypress.Commands.add('fillField', (label: string, text: string) => {
  cy.formField(label).find('input, textarea').clear({force: true}).type(text, {force: true});
});

Cypress.Commands.add('saveForm', () => {
  cy.contains('.mat-mdc-dialog-actions button', 'Enregistrer').click();
});

Cypress.Commands.add('checkA11y', (selector?: string) => {
  // axe is injected as a file: bundled into the spec, its UMD wrapper does not load.
  // Colours are measured on what is on screen: wait until no animation (a dialog opening) is still running.
  cy.window({log: false}).should(window => {
    expect(window.document.getAnimations().filter(animation => animation.playState === 'running'), 'running animations').to.have.length(0);
  });
  cy.readFile<string>('node_modules/axe-core/axe.min.js', 'utf8', {log: false}).then(source => {
    cy.window({log: false}).then(async window => {
      const page = window as unknown as PageWithAxe;
      page.eval(source);
      const result = await page.axe.run(selector ?? window.document, {runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']});
      const report = result.violations.map(violation =>
        `${violation.id} (${violation.impact}): ${violation.nodes.length} élément(s), ex. ${violation.nodes[0].html.slice(0, 140)}`);
      expect(report, 'violations axe').to.deep.equal([]);
    });
  });
});

Cypress.Commands.add('stubCloudinary', () => {
  cy.intercept('POST', 'https://api.cloudinary.com/**', {
    statusCode: 200,
    body: {secure_url: 'https://res.cloudinary.com/seo9axkp/image/upload/fake-test-cover.jpg'},
  }).as('cloudinaryUpload');
});

export {};
