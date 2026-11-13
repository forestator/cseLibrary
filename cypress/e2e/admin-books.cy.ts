type StoredBook = {id: string; name: string; ref: string; status: string; cover: string; authorIds: string[]; seriesId?: string; parentId?: string; by?: string};
type StoredAuthor = {id: string; firstName: string; lastName: string; categoryId?: string; books: StoredBook[]};
type StoredSeries = {id: string; name: string; authorIds: string[]; books: StoredBook[]};
type StoredCategory = {authors?: StoredAuthor[]; series?: StoredSeries[]};

const ADULTS = 'litterature-adulte';
const IMAGINARY = 'litterature-imaginaire';
const NOVELS = 'aa44fb8f-7da3-4781-bc3f-830d8c6b2e2d';
const FOREIGN_NOVELS = '839ecbdc-e64f-44cd-a311-f843005f1976';
const FANTASY = '39d433cd-946d-429d-bdfe-1e65c7d95205';

const category = (library: string, id: string) =>
  cy.task<StoredCategory>('document', `bibliotheque/${library}/categories/${id}`);
const library = (id: string) => cy.task<{authors: Array<{id: string}>}>('document', `bibliotheque/${id}`);
const booksOf = (stored: StoredCategory): StoredBook[] =>
  [...(stored.authors ?? []).flatMap(author => author.books), ...(stored.series ?? []).flatMap(series => series.books)];
const nameOf = (stored: StoredBook) => stored.name.trim();

function openBookForm(collectionLabel: string): void {
  cy.visit('/admin/bibliotheque');
  cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
  cy.contains('button', 'Ajouter un objet').click();
  cy.contains('[role=menuitem]', collectionLabel).click();
  cy.get('.mat-mdc-dialog-title').should('have.text', 'Ajouter un livre');
}

function pickCategory(name: string): void {
  cy.formField('Catégorie').find('mat-select').click();
  cy.contains('mat-option', name).click();
}

function editBook(search: string): void {
  cy.visit('/admin/bibliotheque');
  cy.get('.admin-search-input').type(search);
  cy.get('.admin-table tbody tr').should('have.length', 1);
  cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').click();
  cy.get('.mat-mdc-dialog-title').should('have.text', 'Modifier un livre');
}

describe('Administration: the books of the library', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
  });

  describe('the list', () => {
    it('lists the books of the four libraries, with the name of their category, and finds them by author', () => {
      cy.visit('/admin/bibliotheque');
      cy.get('.admin-table tbody tr').should('have.length.at.least', 20);
      cy.get('.admin-search-input').type('adler');
      cy.get('.admin-table tbody tr').should('have.length', 3);
      cy.contains('.admin-table tbody tr', 'Romans français');
      cy.contains('.admin-table tbody tr', 'Romans étrangers');
    });

    it('shows the books by default and the structure editor on request, one at a time', () => {
      cy.visit('/admin/bibliotheque');
      cy.get('.admin-table').should('exist');
      cy.get('app-settings-view').should('not.exist');
      cy.contains('.admin-chip', 'Structure').click();
      cy.get('app-settings-view').should('contain.text', 'Gestion :');
      cy.get('.admin-table').should('not.exist');
      cy.contains('.admin-chip', 'Livres').click();
      cy.get('.admin-table').should('exist');
      cy.get('app-settings-view').should('not.exist');
    });
  });

  describe('adding a book', () => {
    it('writes it under an existing author of its category, without refusing a cote already used', () => {
      category(ADULTS, FOREIGN_NOVELS).then(foreignBefore => library(ADULTS).then(libraryBefore => {
        openBookForm('Adultes');
        cy.fillField('Titre', 'Zz Livre Test');
        pickCategory('Romans français');
        cy.fillField('Auteur', 'Elizabeth Adler');
        cy.fillField('Cote', 'R-ADL');
        cy.saveForm();
        cy.get('.mat-mdc-dialog-container').should('not.exist');
        category(ADULTS, NOVELS).then(stored => {
          const adler = stored.authors!.find(author => author.lastName === 'Adler')!;
          const added = adler.books.find(book => nameOf(book) === 'Zz Livre Test')!;
          expect(added, 'new book under Adler').to.exist;
          expect(added.ref).to.eq('R-ADL');
          expect(added.seriesId, 'by-author books carry the author id').to.eq(adler.id);
          expect(added.authorIds).to.deep.eq([adler.id]);
          expect(added.id, 'a new book gets an id').to.be.a('string').and.not.empty;
          expect(stored.authors).to.have.length(3);
          expect(adler.books.map(nameOf)).to.include('Un été en Toscane');
        });
        category(ADULTS, FOREIGN_NOVELS).should('deep.equal', foreignBefore);
        library(ADULTS).then(libraryAfter => expect(libraryAfter.authors).to.have.length(libraryBefore.authors.length));
      }));
    });

    it('creates the author, in the category and in the index of the library, when the name is new', () => {
      library(ADULTS).then(libraryBefore => {
        openBookForm('Adultes');
        cy.fillField('Titre', 'Zz Roman Neuf');
        pickCategory('Romans français');
        cy.fillField('Auteur', 'Jeanne Nouvelle');
        cy.saveForm();
        cy.get('.mat-mdc-dialog-container').should('not.exist');
        category(ADULTS, NOVELS).then(stored => {
          const author = stored.authors!.find(candidate => candidate.lastName === 'Nouvelle')!;
          expect(author).to.include({firstName: 'Jeanne', categoryId: NOVELS});
          expect(author.books.map(nameOf)).to.deep.eq(['Zz Roman Neuf']);
          library(ADULTS).then(libraryAfter => {
            expect(libraryAfter.authors).to.have.length(libraryBefore.authors.length + 1);
            expect(libraryAfter.authors.map(candidate => candidate.id)).to.include(author.id);
          });
        });
      });
    });

    it('needs an author for a new book', () => {
      openBookForm('Adultes');
      cy.fillField('Titre', 'Sans auteur');
      pickCategory('Romans français');
      cy.contains('.mat-mdc-dialog-actions button', 'Enregistrer').should('be.disabled');
    });

    it('puts a book of a by-series library into the Divers series, or into the series it names', () => {
      openBookForm('Imaginaire');
      cy.fillField('Titre', 'Zz Fantasy Un');
      pickCategory('Fantasy');
      cy.fillField('Auteur', 'Anne Dragon');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      openBookForm('Imaginaire');
      cy.fillField('Titre', 'Zz Fantasy Deux');
      pickCategory('Fantasy');
      cy.fillField('Auteur', 'Anne Dragon');
      cy.fillField('Série', 'Zz Cycle');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      category(IMAGINARY, FANTASY).then(stored => {
        const series = (name: string) => stored.series!.find(candidate => candidate.name === name)!;
        expect(series('Divers').books.map(nameOf)).to.include('Zz Fantasy Un');
        expect(series('Zz Cycle').books.map(nameOf)).to.deep.eq(['Zz Fantasy Deux']);
        expect(series('Zz Cycle').books[0].parentId).to.eq(series('Zz Cycle').id);
        expect(series('Zz Cycle').authorIds).to.have.length(1);
      });
    });
  });

  describe('editing a book', () => {
    it('changes it where it is, touching nothing else', () => {
      category(ADULTS, NOVELS).then(before => {
        editBook('Un été en Toscane');
        cy.fillField('Titre', 'Un été en Toscane (nouvelle édition)');
        cy.saveForm();
        cy.get('.mat-mdc-dialog-container').should('not.exist');
        category(ADULTS, NOVELS).then(after => {
          const names = booksOf(after).map(nameOf);
          expect(names).to.include('Un été en Toscane (nouvelle édition)');
          expect(names).to.have.length(booksOf(before).length);
          expect(after.authors).to.have.length(before.authors!.length);
        });
      });
    });

    it('moves it to another category of the library without leaving a duplicate', () => {
      editBook('Un été en Toscane');
      pickCategory('Romans étrangers');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      category(ADULTS, NOVELS).then(novels => category(ADULTS, FOREIGN_NOVELS).then(foreign => {
        expect(booksOf(novels).map(nameOf)).not.to.include('Un été en Toscane');
        expect(novels.authors!.map(author => author.lastName), 'author left with no book goes away').not.to.include('Adler');
        const copies = booksOf(foreign).filter(book => nameOf(book) === 'Un été en Toscane');
        expect(copies).to.have.length(1);
        const adler = foreign.authors!.find(author => author.books.some(book => book.id === copies[0].id))!;
        expect(adler.lastName, 'filed under the author already present in that category').to.eq('Adler');
        expect(foreign.authors!.filter(author => author.lastName === 'Adler' && author.firstName === 'Elizabeth')).to.have.length(1);
      }));
    });

    it('writes a new cover as a file name, not as a URL', () => {
      cy.stubCloudinary();
      editBook('Un été en Toscane');
      cy.get('input[type=file]').selectFile({contents: Cypress.Buffer.from('fake image'), fileName: 'cover.png', mimeType: 'image/png'}, {force: true});
      cy.contains('.mat-mdc-dialog-container button', 'Upload').click();
      cy.contains('.cover-note', 'Image envoyée');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      category(ADULTS, NOVELS).then(stored => {
        const book = booksOf(stored).find(candidate => nameOf(candidate) === 'Un été en Toscane')!;
        expect(book.cover).to.eq('fake-test-cover.jpg');
      });
    });

    it('can delete a book after a confirmation', () => {
      editBook('Fièvre de glace');
      cy.contains('.mat-mdc-dialog-actions button', 'Supprimer').click();
      cy.get('app-confirm-modal').should('contain.text', 'Fièvre de glace');
      cy.contains('app-confirm-modal button', 'Supprimer').click();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      category(ADULTS, NOVELS).then(stored => expect(booksOf(stored).map(nameOf)).not.to.include('Fièvre de glace'));
    });
  });

  describe('bulk actions on books', () => {
    it('changes the status of the selected books in the right categories', () => {
      cy.visit('/admin/bibliotheque');
      cy.get('.admin-search-input').type('adler');
      cy.get('.admin-table tbody tr').should('have.length', 3);
      cy.get('input[aria-label="Tout sélectionner"]').check({force: true});
      cy.contains('.admin-selection button', 'Changer le statut').click();
      cy.contains('[role=menuitem]', 'Perdu').click();
      cy.contains('.mat-mdc-snack-bar-container', '3 objet(s)');
      category(ADULTS, NOVELS).then(stored => {
        expect(booksOf(stored).filter(book => nameOf(book).includes('Toscane')).map(book => book.status)).to.deep.eq(['MISSING']);
        expect(booksOf(stored).filter(book => !nameOf(book).includes('Toscane')).every(book => book.status === 'AVAILABLE')).to.be.true;
      });
      category(ADULTS, FOREIGN_NOVELS).then(stored => {
        expect(booksOf(stored).filter(book => ['Une maison à Amalfi', 'La derniere rencontre'].includes(nameOf(book))).map(book => book.status)).to.deep.eq(['MISSING', 'MISSING']);
      });
    });
  });

  describe('accessibility', () => {
    it('has no violation on the list, nor on the book form', () => {
      cy.visit('/admin/bibliotheque');
      cy.get('.admin-table tbody tr').should('have.length.at.least', 3);
      cy.checkA11y();
      cy.contains('button', 'Ajouter un objet').click();
      cy.contains('[role=menuitem]', 'Adultes').click();
      cy.get('.mat-mdc-dialog-container').should('be.visible');
      cy.checkA11y('.mat-mdc-dialog-container');
    });
  });
});
