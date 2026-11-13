describe('Reconciliation: comparing and applying', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
    cy.visit('/admin/reconciliation');
    cy.get('input[type=file]').selectFile('cypress/fixtures/catalogue/reconciliation.csv', {force: true});
    cy.get('[data-test=count-toAdd]').should('exist');
  });

  const count = (name: string) => cy.get(`[data-test=count-${name}]`);
  const list = (name: string) => cy.get(`[data-list=${name}] tbody tr`);

  it('sorts the lines of the file into lists', () => {
    count('toAdd').should('have.text', '2');
    count('probable').should('have.text', '1');
    count('moves').should('have.text', '1');
    count('conflicts').should('have.text', '1');
    count('duplicates').should('have.text', '1');
    list('toAdd').should('have.length', 2);
    cy.get('[data-list=toAdd]').should('contain.text', 'Wingspan').and('contain.text', 'Azul');
    cy.get('[data-list=missing]').should('exist');
  });

  it('announces what will be written before anything is written', () => {
    cy.get('[data-test=plan]').should('contain.text', '2 ajout(s) et 0 déplacement(s)');
    cy.get('[data-list=toAdd] .reco-check').first().uncheck();
    cy.get('[data-test=plan]').should('contain.text', '1 ajout(s)');
    cy.get('[data-list=moves] .reco-check').check();
    cy.get('[data-test=plan]').should('contain.text', '1 ajout(s) et 1 déplacement(s)');
  });

  it('writes the ticked lines, one journal entry per collection, then proposes nothing the second time', () => {
    cy.get('[data-list=moves] .reco-check').check();
    cy.contains('button', 'Appliquer').click();
    cy.get('mat-dialog-container').contains('button', 'Appliquer').click();
    cy.contains('appliqués');
    cy.task('document', 'ludotheque/boardGames').then((doc: any) => {
      expect(doc.games.ludo400.name).to.equal('Wingspan');
      expect(doc.games.ludo401.name).to.equal('Azul');
            expect(doc.games.ludo343.name).to.equal('Tax the Rich');
    });
    cy.task('document', 'commissions/bricolage').then((doc: any) => {
      expect(doc.tools.bois['913'].name).to.contain('Pointeur Satellite');
      expect(doc.tools.Electronique['913']).to.equal(undefined);
    });
    count('toAdd').should('have.text', '0');
    count('moves').should('have.text', '0');
    cy.visit('/admin/journal');
    cy.get('table tbody tr').filter(':contains("Import")').should('have.length', 2);
  });

  it('does not write the lines that are not ticked', () => {
    cy.get('[data-list=toAdd] .reco-check').eq(1).uncheck();
    cy.contains('button', 'Appliquer').click();
    cy.get('mat-dialog-container').contains('button', 'Appliquer').click();
    cy.contains('appliqués');
    cy.task('document', 'ludotheque/boardGames').then((doc: any) => {
      expect(Object.keys(doc.games).filter(key => ['ludo400', 'ludo401'].includes(key))).to.have.length(1);
    });
  });

  it('proposes nothing to write when the same file is dropped again after an apply', () => {
    cy.get('[data-list=moves] .reco-check').check();
    cy.contains('button', 'Appliquer').click();
    cy.get('mat-dialog-container').contains('button', 'Appliquer').click();
    cy.contains('appliqués');
    cy.reload();
    cy.get('input[type=file]').selectFile('cypress/fixtures/catalogue/reconciliation.csv', {force: true});
    count('toAdd').should('have.text', '0');
    count('moves').should('have.text', '0');
    cy.get('[data-list=toAdd]').should('not.exist');
    cy.get('[data-list=moves]').should('not.exist');
    cy.get('[data-test=plan]').should('contain.text', '0 ajout(s) et 0 déplacement(s)');
    cy.contains('button', 'Appliquer').should('be.disabled');
  });

  it('remembers « Ne plus proposer » after a reload', () => {
    cy.get('[data-list=toAdd]').contains('tr', 'Azul').contains('button', 'Ne plus proposer').click();
    count('toAdd').should('have.text', '1');
    cy.reload();
    cy.get('input[type=file]').selectFile('cypress/fixtures/catalogue/reconciliation.csv', {force: true});
    count('toAdd').should('have.text', '1');
    cy.get('[data-list=toAdd]').should('not.contain.text', 'Azul');
  });

  it('downloads a CSV report', () => {
    cy.window().then(window => cy.stub(window.URL, 'createObjectURL').as('url').returns('blob:test'));
    cy.contains('button', 'Rapport CSV').click();
    cy.get('@url').should('have.been.calledOnce');
  });

  it('has no accessibility violation once the lists are shown', () => {
    cy.checkA11y();
  });
});
