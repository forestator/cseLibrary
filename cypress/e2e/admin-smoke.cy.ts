describe('Administration (smoke)', () => {
  before(() => cy.task('resetData'));
  beforeEach(() => cy.loginAsAdmin());

  it('offers the commissions and shows no table until one is chosen', () => {
    cy.visit('/admin');
    cy.contains('.admin-card-title', 'Bricolage');
    cy.get('.admin-table').should('not.exist');
  });

  it('is reachable from the side rail once signed in', () => {
    cy.visit('/');
    cy.contains('.rail-link-admin', 'Administration').click();
    cy.location('pathname').should('eq', '/admin');
  });

  it('lists the objects of a commission and opens the shared form on one of them', () => {
    cy.visit('/admin/bricolage');
    cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
    cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').first().click();
    cy.get('.mat-mdc-dialog-title').should('have.text', 'Modifier un outil');
  });
});
