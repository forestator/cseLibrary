describe('Administration: the list of a commission', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
  });

  const names = () => cy.get('.admin-table tbody th.admin-name').then(cells => [...cells].map(cell => (cell.textContent ?? '').trim()));
  const header = (label: string) => cy.contains('.admin-table thead th', label);
  const compare = (first: string, second: string) => first.localeCompare(second, 'fr', {numeric: true, sensitivity: 'base'});

  it('sorts by a column, reverses it, then goes back to the default order', () => {
    cy.visit('/admin/bricolage');
    cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
    names().then(defaultOrder => {
      header('Nom').find('button').click();
      header('Nom').should('have.attr', 'aria-sort', 'ascending');
      names().should('deep.equal', [...defaultOrder].sort(compare));

      header('Nom').find('button').click();
      header('Nom').should('have.attr', 'aria-sort', 'descending');
      names().should('deep.equal', [...defaultOrder].sort(compare).reverse());

      header('Nom').find('button').click();
      header('Nom').should('not.have.attr', 'aria-sort');
      names().should('deep.equal', defaultOrder);
    });
  });

  it('sorts the games of the ludotheque by reference number, not by text', () => {
    cy.visit('/admin/ludotheque');
    cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
    header('Réf.').find('button').click();
    header('Réf.').then(cell => cell.index() + 1).then(position => cy.get(`.admin-table tbody tr td:nth-child(${position})`)).then(cells => {
      const numbers = [...cells].map(cell => /^ludo(\d+)$/.exec((cell.textContent ?? '').trim())?.[1]).filter(Boolean).map(Number);
      expect(numbers.length).to.be.at.least(3);
      expect(numbers).to.deep.equal([...numbers].sort((first, second) => first - second));
    });
  });

  it('starts again from the default order when another commission is picked', () => {
    cy.visit('/admin/bricolage');
    header('Nom').find('button').click();
    header('Nom').should('have.attr', 'aria-sort', 'ascending');
    cy.contains('a', 'Toutes les commissions').click();
    cy.contains('.admin-card-title', 'Photo').click();
    header('Nom').should('not.have.attr', 'aria-sort');
  });

  it('has no accessibility violation once sorted', () => {
    cy.visit('/admin/bricolage');
    header('Nom').find('button').click();
    header('Nom').should('have.attr', 'aria-sort', 'ascending');
    cy.checkA11y();
  });
});
