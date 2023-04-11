describe('Test ludotheque', () => {
  it('load ludotheque', () => {
    cy.visit('/ludotheque');
    cy.contains('Jeux vidéos');
    cy.contains('Jeux de société');
    cy.contains('Grand Jeux');
    cy.contains('Nouveautés');
    cy.get('#ludoSearch');
  })
  it('should allow search in board games', () => {
    cy.visit('/ludotheque/boardGames/enfant');
    cy.wait(5000);
    cy.get('#ludoSearch').click();
    cy.get('#ludoSearch').type('Splendor duel');
    cy.get('#ludoSearch').type('{enter}');
    cy.url().should('include', '/ludotheque/boardGames/duo/364073');
    cy.get('#364073').should('exist');
  });
  it('should load video games', () => {
    cy.visit('/ludotheque/videoGames');
    cy.get('#switch').should('exist');
    cy.get('#ps4').should('exist');
    cy.get('#ps5').should('exist');
    cy.get('#xboxOne').should('exist');
    cy.get('#switch').click();
    cy.url().should('include', '/ludotheque/videoGames/switch');
    cy.get('#SW-CONSL01').should('exist');
    cy.get('#1254').should('exist');
    cy.get('#ludoSearch').click();
    cy.get('#ludoSearch').type('Splendor duel');
    cy.get('#ludoSearch').type('{enter}');
    cy.url().should('include', '/ludotheque/videoGames/switch');
    cy.get('#ludoSearch').clear();
    cy.get('#ludoSearch').type('Last');
    cy.get('#ludoSearch').type('{enter}');
    cy.url().should('include', '/ludotheque/videoGames/ps4/1199');
  });
})
