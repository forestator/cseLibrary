describe('Reconciliation: reading the catalogue file', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
    cy.visit('/admin/reconciliation');
  });

  const drop = (name: string) => cy.get('input[type=file]').selectFile(`cypress/fixtures/catalogue/${name}`, {force: true});
  const firstRows = () => cy.get('[aria-labelledby=reco-preview-title] .reco-table tbody tr');

  describe('every format gives the same catalogue', () => {
    for (const name of ['sample.xlsx', 'sample.xls', 'sample.ods', 'sample-utf8.csv', 'sample-windows1252.csv', 'sample.tsv']) {
      it(`reads ${name}`, () => {
        drop(name);
        cy.contains('.reco-message', '40 lignes lues');
        firstRows().should('have.length', 8);
        firstRows().eq(0).should('contain.text', '0000000000228').and('contain.text', 'MACON').and('contain.text', '4 ETAIS 2.50M');
        firstRows().eq(3).should('contain.text', 'Astérix & Obélix — Baffez-les tous').and('contain.text', 'GOSCINNY René');
        firstRows().eq(5).should('contain.text', 'R-ADA').and('contain.text', 'ADAM OLIVIER');
        firstRows().eq(7).should('contain.text', 'Le "grand" jeu; suite — tome 2');
        cy.contains('.reco-message', 'caractères abîmés').should('not.exist');
      });
    }
  });

  it('keeps the leading zeros of the barcodes', () => {
    drop('sample.xlsx');
    firstRows().eq(1).should('contain.text', '0778988323496');
    firstRows().eq(6).should('contain.text', '0045496501419');
  });

  it('lets the user pick the sheet when the workbook has several', () => {
    drop('sample-two-sheets.xlsx');
    cy.get('.reco-select').first().find('option').should('have.length', 2);
    cy.contains('.reco-message', 'colonnes à préciser');
    cy.get('.reco-select').first().select('Catalogue (41 lignes)');
    cy.contains('.reco-message', '40 lignes lues');
  });

  it('skips the title lines above the header', () => {
    drop('sample-title-lines.csv');
    cy.contains('.reco-message', '40 lignes lues');
    firstRows().eq(0).should('contain.text', '4 ETAIS 2.50M');
  });

  it('asks which column is which when the headers are unknown, then reads the file', () => {
    drop('sample-unknown-headers.csv');
    cy.get('.reco-error').should('contain.text', 'Titre');
    const choose = (label: string, column: string) => cy.contains('.reco-field', label).find('select').select(column);
    choose('Titre', 'Colonne 3');
    cy.get('.reco-error').should('contain.text', 'Type');
    choose('Type', 'Colonne 2');
    choose('Code-barres', 'Colonne 1');
    choose('Cote', 'Colonne 4');
    cy.get('.reco-error').should('not.exist');
    cy.contains('.reco-message', '40 lignes lues');
    firstRows().eq(2).should('contain.text', '50 Missions').and('contain.text', 'Ludo196');
  });

  it('says so when the file cannot be read', () => {
    drop('not-a-table.pdf');
    cy.get('.reco-error').should('contain.text', 'n\'a pas pu être lu');
    cy.get('.reco-table').should('not.exist');
  });

  it('has no accessibility violation, before and after a file is read', () => {
    cy.checkA11y();
    drop('sample.xlsx');
    cy.contains('.reco-message', '40 lignes lues');
    cy.checkA11y();
  });
});
