describe('Public pages (smoke)', () => {
  it('shows the commissions and their next opening on the home page', () => {
    cy.visitAsVisitor('/');
    cy.get('.card-title').should('have.length.at.least', 6);
    cy.contains('.card-note', 'Prochaine commission');
  });

  it('lists the board games of a category', () => {
    cy.visitAsVisitor('/ludotheque/boardGames/familial');
    cy.get('article.card').should('have.length.at.least', 1);
  });

  it('keeps the administration out of reach of a visitor', () => {
    cy.visitAsVisitor('/admin');
    cy.location('pathname').should('eq', '/');
    cy.get('.admin-table').should('not.exist');
  });
});
