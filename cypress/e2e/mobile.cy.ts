describe('Mobile', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
  });

  const noSidewaysScroll = () =>
    cy.document().then(document => {
      expect(document.documentElement.scrollWidth, 'page width').to.be.at.most(document.documentElement.clientWidth);
    });

  it('opens the side menu from its button and reaches a commission', () => {
    cy.visitAsVisitor('/');
    cy.get('button[aria-label="Ouvrir le menu"]').click();
    cy.contains('.rail-link', 'Ludothèque').click();
    cy.location('pathname').should('eq', '/ludotheque');
  });

  it('offers the filters of the board games', () => {
    cy.visitAsVisitor('/ludotheque/boardGames/familial');
    cy.get('article.card').should('have.length.at.least', 1);
    cy.contains('button.filters-button', 'Filtres').click();
    cy.get('[role=dialog]').should('be.visible');
  });

  for (const [name, path, ready] of [
    ['home', '/', '.card-title'],
    ['board games', '/ludotheque/boardGames/familial', 'article.card'],
    ['video games and old consoles', '/ludotheque/videoGames', '.legacy-link'],
    ['bricolage', '/bricolage/bois', 'app-catalogue-item-card'],
  ] as const) {
    it(`${name} does not scroll sideways`, () => {
      cy.visitAsVisitor(path);
      cy.get(ready).should('exist');
      noSidewaysScroll();
    });
  }

  it('has no accessibility violation on a game page', () => {
    cy.visitAsVisitor('/ludotheque/boardGames/familial');
    cy.get('article.card').should('have.length.at.least', 1);
    cy.checkA11y();
  });
});

describe('Mobile administration', () => {
  beforeEach(() => {
    cy.viewport(390, 844);
    cy.task('resetData');
    cy.loginAsAdmin();
  });

  it('keeps the commission picker and the list readable without sideways page scroll', () => {
    cy.visit('/admin');
    cy.get('.admin-card').should('have.length', 6);
    cy.visit('/admin/bricolage');
    cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
    cy.document().then(document => {
      expect(document.documentElement.scrollWidth, 'page width').to.be.at.most(document.documentElement.clientWidth);
    });
  });
});
