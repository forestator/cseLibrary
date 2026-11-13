type StoredTools = Record<string, Record<string, {name: string; status?: string}>>;
type StoredGames = Record<string, {name: string; status?: string}>;

const toolStatuses = () => cy.task<{tools: StoredTools}>('document', 'commissions/bricolage').then(document =>
  Object.fromEntries(Object.values(document.tools).flatMap(category => Object.values(category).map(tool => [tool.name, tool.status ?? '']))));
const gameStatuses = (library: string) => cy.task<{games: StoredGames}>('document', `ludotheque/${library}`).then(document =>
  Object.fromEntries(Object.values(document.games).map(game => [game.name, game.status ?? ''])));

const rowNames = () => cy.get('.admin-table tbody th.admin-name').then(cells => [...cells].map(cell => (cell.textContent ?? '').trim()));
const select = (name: string) => cy.get(`input[aria-label="Sélectionner ${name}"]`).check({force: true});

describe('Administration: bulk actions and export', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
  });

  describe('selection', () => {
    it('selects every row of the list with the header checkbox, and clears with the bar button', () => {
      cy.visit('/admin/bricolage');
      cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
      cy.get('input[aria-label="Tout sélectionner"]').check({force: true});
      cy.get('.admin-table tbody tr').its('length').then(count => {
        cy.get('.admin-selection-count').should('contain.text', `${count} sélectionné`);
      });
      cy.contains('.admin-selection button', 'Tout désélectionner').click();
      cy.get('.admin-selection').should('not.exist');
    });

    it('drops the selection when the list is filtered, so a bulk action never reaches a hidden row', () => {
      cy.visit('/admin/bricolage');
      rowNames().then(names => select(names[0]));
      cy.get('.admin-selection').should('exist');
      cy.get('.admin-search-input').type('a');
      cy.get('.admin-selection').should('not.exist');
    });
  });

  describe('bulk status change', () => {
    it('changes the status of the selected items only', () => {
      cy.visit('/admin/bricolage');
      toolStatuses().then(before => {
        rowNames().then(names => {
          const [first, second] = names;
          select(first);
          select(second);
          cy.contains('.admin-selection button', 'Changer le statut').click();
          cy.contains('[role=menuitem]', 'En Réparation').click();
          cy.contains('.mat-mdc-snack-bar-container', '2 objet(s)');
          toolStatuses().then(after => {
            expect(after[first]).to.eq('REPARATION');
            expect(after[second]).to.eq('REPARATION');
            for (const name of Object.keys(before).filter(key => key !== first && key !== second)) {
              expect(after[name], name).to.eq(before[name]);
            }
          });
          cy.get('.admin-selection').should('not.exist');
        });
      });
    });

    it('reaches the three kinds of games of the ludotheque with one action', () => {
      cy.visit('/admin/ludotheque');
      cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
      cy.get('input[aria-label="Tout sélectionner"]').check({force: true});
      cy.contains('.admin-selection button', 'Changer le statut').click();
      cy.contains('[role=menuitem]', 'Perdu').click();
      cy.contains('.mat-mdc-snack-bar-container', 'objet(s)');
      for (const library of ['boardGames', 'videoGames', 'outsideGames']) {
        gameStatuses(library).then(statuses => {
          expect(Object.keys(statuses).length, library).to.be.at.least(1);
          expect(Object.values(statuses), library).to.satisfy((values: string[]) => values.every(status => status === 'MISSING'));
        });
      }
    });
  });

  describe('bulk delete', () => {
    it('asks for a confirmation, keeps everything when cancelled and removes the selection when confirmed', () => {
      cy.visit('/admin/bricolage');
      toolStatuses().then(before => {
        rowNames().then(names => {
          const [first, second] = names;
          select(first);
          select(second);
          cy.contains('.admin-selection button', 'Supprimer').click();
          cy.get('app-confirm-modal').should('contain.text', 'Supprimer 2 objet(s)');
          cy.contains('app-confirm-modal button', 'Annuler').click();
          toolStatuses().then(unchanged => expect(Object.keys(unchanged)).to.have.length(Object.keys(before).length));
          cy.contains('.admin-selection button', 'Supprimer').click();
          cy.contains('app-confirm-modal button', 'Supprimer').click();
          cy.contains('.mat-mdc-snack-bar-container', '2 objet(s) supprimé');
          toolStatuses().then(after => {
            expect(after).not.to.have.property(first);
            expect(after).not.to.have.property(second);
            expect(Object.keys(after)).to.have.length(Object.keys(before).length - 2);
          });
        });
      });
    });
  });

  describe('CSV export', () => {
    const today = new Date().toISOString().slice(0, 10);

    it('exports the whole list as a French spreadsheet reads it', () => {
      cy.visit('/admin/bricolage');
      cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
      cy.get('.admin-table tbody tr').its('length').then(count => {
        cy.contains('button', 'Exporter en CSV').click();
        cy.readFile(`cypress/downloads/catalogue-bricolage-${today}.csv`, 'utf8').then((csv: string) => {
          expect(csv.charCodeAt(0), 'byte order mark').to.eq(0xfeff);
          const lines = csv.trimEnd().split('\r\n');
          expect(lines[0]).to.eq('﻿"Nom";"Catégorie";"Référence";"Statut";"Couverture"');
          expect(lines).to.have.length(count + 1);
          expect(lines[1].split('";"')).to.have.length(5);
        });
      });
    });

    it('exports the filtered list in the order shown', () => {
      cy.visit('/admin/bricolage');
      cy.get('.admin-search-input').type('remorque');
      cy.get('.admin-table tbody tr').should('have.length', 3);
      cy.contains('.admin-table thead th', 'Nom').find('button').click();
      rowNames().then(names => {
        cy.contains('button', 'Exporter en CSV').click();
        cy.readFile(`cypress/downloads/catalogue-bricolage-${today}.csv`, 'utf8').then((csv: string) => {
          const exported = csv.trimEnd().split('\r\n').slice(1).map(line => line.split('";"')[0].replace('"', ''));
          expect(exported).to.deep.equal(names);
        });
      });
    });
  });

  it('has no accessibility violation with a selection', () => {
    cy.visit('/admin/bricolage');
    rowNames().then(names => select(names[0]));
    cy.get('.admin-selection').should('be.visible');
    cy.checkA11y();
  });
});
