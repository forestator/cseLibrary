const JOURNAL = 'http://127.0.0.1:8080/v1/projects/cseh-50966/databases/(default)/documents';
const AUTH = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1';

const str = (value: string) => ({stringValue: value});
const entryFields = (overrides: Record<string, {stringValue: string}> = {}) => ({
  uid: str('ls9tc3kKxeRlkaXAccs0qk9T9oA2'), email: str('bricolage-test@example.com'), action: str('update'),
  commission: str('bricolage'), collection: str('bricolage'), collectionLabel: str('Bricolage'), itemName: str('Perceuse'),
  summary: str('Modification de « Perceuse »'), changes: {arrayValue: {}}, count: {integerValue: '1'}, names: {arrayValue: {}},
  ...overrides,
});

describe('Administration: the journal of changes', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
  });

  const rows = () => cy.get('.journal-table tbody tr');

  function editFirstTool(): void {
    cy.visit('/admin/bricolage');
    cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').first().click();
    cy.fillField('Description', 'Description du journal');
    cy.saveForm();
    cy.get('.mat-mdc-dialog-container').should('not.exist');
  }

  describe('what it records', () => {
    it('writes an entry for an addition, a modification and a deletion, newest first', () => {
      cy.visit('/admin/bricolage');
      cy.contains('button', 'Ajouter un objet').click();
      cy.fillField('Nom', 'Zz Journal');
      cy.fillField('Référence', 'zzj1');
      cy.formField('Catégorie').find('mat-select').click();
      cy.contains('mat-option', 'Bois').click();
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');

      cy.get('.admin-search-input').type('Zz Journal');
      cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').click();
      cy.fillField('Description', 'Une description');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');

      cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').click();
      cy.contains('.mat-mdc-dialog-actions button', 'Supprimer').click();
      cy.contains('app-confirm-modal button', 'Supprimer').click();
      cy.get('.mat-mdc-dialog-container').should('not.exist');

      cy.visit('/admin/journal');
      rows().should('have.length', 3);
      rows().eq(0).should('contain.text', 'Suppression').and('contain.text', 'Zz Journal');
      rows().eq(1).should('contain.text', 'Modification').and('contain.text', 'Description : — → Une description');
      rows().eq(2).should('contain.text', 'Ajout').and('contain.text', 'Bricolage');
      rows().each(row => cy.wrap(row).should('contain.text', Cypress.env('adminEmail')));
    });

    it('writes nothing for a modification that changes nothing', () => {
      cy.visit('/admin/bricolage');
      cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').first().click();
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      cy.visit('/admin/journal');
      cy.contains('.journal-empty', 'Aucune modification');
    });

    it('writes one entry for a bulk status change, with the number of objects and their names', () => {
      cy.visit('/admin/bricolage');
      cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
      cy.get('input[aria-label="Tout sélectionner"]').check({force: true});
      cy.contains('.admin-selection button', 'Changer le statut').click();
      cy.contains('[role=menuitem]', 'En Réparation').click();
      cy.contains('.mat-mdc-snack-bar-container', 'objet(s)');
      cy.visit('/admin/journal');
      rows().should('have.length', 1);
      rows().eq(0).should('contain.text', 'Changement de statut').and('contain.text', 'passés à « En Réparation »');
    });

    it('writes a book change, with the name of its category', () => {
      cy.visit('/admin/bibliotheque');
      cy.get('.admin-search-input').type('Fièvre de glace');
      cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').click();
      cy.fillField('Titre', 'Fièvre de glace (poche)');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      cy.visit('/admin/journal');
      rows().eq(0).should('contain.text', 'Titre : Fièvre de glace').and('contain.text', 'Fièvre de glace (poche)');
    });
  });

  describe('the page', () => {
    it('sorts by a column and filters by the kind of action', () => {
      editFirstTool();
      cy.visit('/admin/bricolage');
      cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').eq(1).click();
      cy.contains('.mat-mdc-dialog-actions button', 'Supprimer').click();
      cy.contains('app-confirm-modal button', 'Supprimer').click();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      cy.visit('/admin/journal');
      rows().should('have.length', 2);
      cy.contains('.journal-table thead th', 'Action').find('button').click();
      cy.contains('.journal-table thead th', 'Action').should('have.attr', 'aria-sort', 'ascending');
      rows().eq(0).should('contain.text', 'Modification');
      cy.contains('.journal-table thead th', 'Action').find('button').click();
      rows().eq(0).should('contain.text', 'Suppression');
      cy.contains('.journal-chip', 'Suppression').click();
      rows().should('have.length', 1).and('contain.text', 'Suppression');
    });

    it('is reachable from the administration page, and has no accessibility violation', () => {
      editFirstTool();
      cy.visit('/admin');
      cy.contains('.admin-card', 'Journal des modifications').click();
      cy.location('pathname').should('eq', '/admin/journal');
      rows().should('have.length', 1);
      cy.checkA11y();
    });
  });

  describe('who can read and write it (the rules themselves, with the account of one commission)', () => {
    const signIn = (email: string, password: string) =>
      cy.request('POST', `${AUTH}/accounts:signInWithPassword?key=test`, {email, password, returnSecureToken: true})
        .then(response => response.body.idToken as string);

    const commit = (token: string | undefined, fields: object, transforms: object[], id = `test-${Date.now()}`) =>
      cy.request({
        method: 'POST', url: `${JOURNAL}:commit`, failOnStatusCode: false,
        headers: token ? {Authorization: `Bearer ${token}`} : {},
        body: {writes: [{update: {name: `projects/cseh-50966/databases/(default)/documents/journal/${id}`, fields}, updateTransforms: transforms}]},
      });
    const serverTime = [{fieldPath: 'at', setToServerValue: 'REQUEST_TIME'}];

    it('lets the administrator of a commission add an entry for that commission only', () => {
      signIn(Cypress.env('commissionAdminEmail'), Cypress.env('commissionAdminPassword')).then(token => {
        commit(token, entryFields(), serverTime).its('status').should('eq', 200);
        commit(token, entryFields({commission: str('ludotheque')}), serverTime).its('status').should('eq', 403);
        commit(token, entryFields({uid: str('someone-else')}), serverTime).its('status').should('eq', 403);
        commit(token, {...entryFields(), at: {timestampValue: '2020-01-01T00:00:00Z'}}, []).its('status').should('eq', 403);
        commit(token, {...entryFields(), extra: str('not allowed')}, serverTime).its('status').should('eq', 403);
      });
    });

    it('refuses anonymous visitors, and refuses the reading to a commission administrator', () => {
      commit(undefined, entryFields(), serverTime).its('status').should('eq', 403);
      signIn(Cypress.env('commissionAdminEmail'), Cypress.env('commissionAdminPassword')).then(token => {
        cy.request({url: `${JOURNAL}/journal`, headers: {Authorization: `Bearer ${token}`}, failOnStatusCode: false}).its('status').should('eq', 403);
      });
    });

    it('never lets an entry be changed or removed, not even by a super-administrator', () => {
      signIn(Cypress.env('adminEmail'), Cypress.env('adminPassword')).then(token => {
        commit(token, entryFields({uid: str('OBWB7BXsEHPYmauZ6NqwEzcuc0x2')}), serverTime, 'fixed-entry').its('status').should('eq', 200);
        cy.request({url: `${JOURNAL}/journal/fixed-entry`, headers: {Authorization: `Bearer ${token}`}}).its('status').should('eq', 200);
        cy.request({method: 'PATCH', url: `${JOURNAL}/journal/fixed-entry?updateMask.fieldPaths=summary`, headers: {Authorization: `Bearer ${token}`},
          body: {fields: {summary: str('rewritten')}}, failOnStatusCode: false}).its('status').should('eq', 403);
        cy.request({method: 'DELETE', url: `${JOURNAL}/journal/fixed-entry`, headers: {Authorization: `Bearer ${token}`}, failOnStatusCode: false})
          .its('status').should('eq', 403);
      });
    });
  });
});
