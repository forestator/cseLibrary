describe('Search (public)', () => {
  it('finds a game from any ludotheque page and opens its category', () => {
    cy.visitAsVisitor('/ludotheque');
    cy.get('#ludoSearch').type('Tax the');
    cy.contains('mat-option', 'Tax the Rich').click();
    cy.location('pathname').should('include', '/ludotheque/boardGames/familial');
    cy.get('article.card').should('have.length.at.least', 1);
  });

  it('says so when no game matches', () => {
    cy.visitAsVisitor('/ludotheque');
    cy.get('#ludoSearch').type('zzzzzzzz');
    cy.get('mat-option').should('have.length', 1).and('have.class', 'mdc-list-item--disabled');
  });

  it('finds a book from the library page, by title', () => {
    cy.visitAsVisitor('/bibliotheque');
    cy.get('#librarySearch').type('Cavalier vert');
    cy.contains('mat-option', 'Cavalier vert').click();
    cy.location('pathname').should('include', '/bibliotheque/litterature-imaginaire');
  });

  it('does not offer the declassed books to a visitor', () => {
    cy.visitAsVisitor('/bibliotheque');
    cy.get('#librarySearch').type('Fendragon');
    cy.get('mat-option').should('have.length', 1).and('have.class', 'mdc-list-item--disabled');
  });

  it('clears the search with its button', () => {
    cy.visitAsVisitor('/ludotheque');
    cy.get('#ludoSearch').type('Tax');
    cy.get('button[aria-label="Effacer la recherche"]').click();
    cy.get('#ludoSearch').should('have.value', '');
  });
});
