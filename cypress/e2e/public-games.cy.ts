describe('Ludotheque (public)', () => {
  beforeEach(() => cy.visitAsVisitor('/'));

  it('opens the detail panel from the tile itself and closes it with Escape', () => {
    cy.visit('/ludotheque/boardGames/familial');
    cy.get('.card-open').first().click();
    cy.get('.detail-panel-overlay').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('.detail-panel-overlay').should('not.exist');
  });

  it('shows no separate Détails button any more', () => {
    cy.visit('/ludotheque/boardGames/familial');
    cy.get('article.card').should('have.length.at.least', 1);
    cy.contains('article.card button', 'Détails').should('not.exist');
  });

  it('orders the board games by inventory number, the latest purchase first, references without a number last', () => {
    cy.visit('/ludotheque/boardGames/ambiance');
    cy.get('article.card').should('have.length', 3);
    cy.get('article.card .card-fact').then(facts => {
      const references = [...facts].map(fact => /Réf\. (\S+)/.exec(fact.textContent ?? '')?.[1]).filter(Boolean);
      expect(references).to.deep.equal(['ludo342', 'ludo96', 'ludoDefifoo']);
    });
  });

  it('keeps the old consoles in their own discreet section', () => {
    cy.visit('/ludotheque/videoGames');
    cy.get('app-tile-card').should('have.length', 6);
    cy.contains('app-section-title', 'Anciennes consoles');
    cy.get('.legacy-link').should('have.length', 8).first().click();
    cy.location('pathname').should('match', /\/ludotheque\/videoGames\/\w+$/);
    cy.get('article.card').should('have.length.at.least', 1);
  });
});
