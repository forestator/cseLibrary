describe('Administration: the library', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
  });

  it('embeds the library editor, one library at a time', () => {
    cy.visit('/admin/bibliotheque');
    cy.get('.admin-chip').should('have.length', 4);
    cy.get('app-settings-view').should('contain.text', 'Gestion :');
    cy.contains('.admin-chip', 'Inclassable').click();
    cy.get('app-settings-view').should('contain.text', 'Inclassable');
  });

  it('offers no administration link on the public pages of the library and of the ludotheque', () => {
    for (const page of ['/bibliotheque', '/ludotheque']) {
      cy.visit(page);
      cy.get('.page').should('exist');
      cy.contains('Administration ludothèque').should('not.exist');
      cy.contains('Administration biblio').should('not.exist');
    }
  });
});
