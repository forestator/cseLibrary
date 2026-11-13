// WCAG A and AA, checked with axe on the pages and dialogs that matter most.
describe('Accessibility', () => {
  describe('public pages', () => {
    for (const [name, path, ready] of [
      ['home', '/', '.card-title'],
      ['ludotheque', '/ludotheque', 'app-tile-card'],
      ['board games', '/ludotheque/boardGames/familial', 'article.card'],
      ['video games and old consoles', '/ludotheque/videoGames', '.legacy-link'],
      ['bricolage', '/bricolage/bois', 'app-catalogue-item-card'],
    ] as const) {
      it(`${name} has no violation`, () => {
        cy.visitAsVisitor(path);
        cy.get(ready).should('exist');
        cy.checkA11y();
      });
    }

    it('the detail panel has no violation', () => {
      cy.visitAsVisitor('/ludotheque/boardGames/familial');
      cy.get('.card-open').first().click();
      cy.get('.detail-panel-overlay').should('be.visible');
      cy.checkA11y('.detail-panel-overlay');
    });
  });

  describe('administration', () => {
    beforeEach(() => {
      cy.task('resetData');
      cy.loginAsAdmin();
    });

    it('the commission picker and a commission list have no violation', () => {
      cy.visit('/admin');
      cy.get('.admin-card[data-commission]').should('have.length', 6);
      cy.checkA11y();
      cy.visit('/admin/ludotheque');
      cy.get('.admin-table tbody tr').should('have.length.at.least', 1);
      cy.checkA11y();
    });

    it('the shared form has no violation, for a board game and for a tool', () => {
      cy.visit('/admin/ludotheque');
      cy.contains('button', 'Ajouter un objet').click();
      cy.contains('[role=menuitem]', 'Jeux de société').click();
      cy.get('.mat-mdc-dialog-container').should('be.visible');
      cy.checkA11y('.mat-mdc-dialog-container');
      cy.contains('.mat-mdc-dialog-actions button', 'Annuler').click();
      cy.visit('/admin/bricolage');
      cy.contains('button', 'Ajouter un objet').click();
      cy.get('.mat-mdc-dialog-container').should('be.visible');
      cy.checkA11y('.mat-mdc-dialog-container');
    });
  });
});
