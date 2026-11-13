type StoredGames = Record<string, Record<string, unknown>>;
type StoredTools = Record<string, Record<string, Record<string, unknown>>>;

const games = (library: 'boardGames' | 'videoGames' | 'outsideGames') =>
  cy.task<{games: StoredGames}>('document', `ludotheque/${library}`).then(document => document.games);
const tools = () => cy.task<{tools: StoredTools}>('document', 'commissions/bricolage').then(document => document.tools);

function openForm(path: string, addMenuEntry?: string): void {
  cy.visit(path);
  cy.contains('button', 'Ajouter un objet').click();
  if (addMenuEntry) {
    cy.contains('[role=menuitem]', addMenuEntry).click();
  }
}

function searchAndEdit(text: string): void {
  cy.get('.admin-search-input').clear().type(text);
  cy.get('.admin-table tbody tr').should('have.length', 1);
  cy.get('.admin-table tbody tr button[aria-label^="Modifier"]').click();
}

describe('Administration: the shared item form', () => {
  beforeEach(() => {
    cy.task('resetData');
    cy.loginAsAdmin();
  });

  describe('board games', () => {
    function addTestGame(): void {
      openForm('/admin/ludotheque', 'Jeux de société');
      cy.get('.mat-mdc-dialog-title').should('have.text', 'Ajouter un jeu de société');
      cy.fillField('Nom', 'Zz Test Jeu');
      cy.fillField('Référence', 'zztest1');
      cy.formField('Catégorie').find('mat-select').click();
      cy.contains('mat-option', 'Duo').click();
      cy.fillField('Description', 'Jeu de test');
      cy.fillField('Minimum de joueurs', '2');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
    }

    it('adds a game with the defaults of a new one', () => {
      addTestGame();
      games('boardGames').then(stored => {
        expect(stored['zztest1']).to.deep.include({
          name: 'Zz Test Jeu', ref: 'zztest1', category: 'duo', description: 'Jeu de test', minPlayers: 2,
          status: 'AVAILABLE', isNew: true, libraryId: 'boardGames',
        });
      });
    });

    it('moves a game that changes reference, leaving no duplicate', () => {
      addTestGame();
      searchAndEdit('Zz Test');
      cy.get('.mat-mdc-dialog-title').should('have.text', 'Modifier un jeu de société');
      cy.fillField('Référence', 'zztest2');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      games('boardGames').then(stored => {
        expect(stored).not.to.have.property('zztest1');
        expect(stored['zztest2']).to.deep.include({name: 'Zz Test Jeu', ref: 'zztest2'});
      });
    });

    it('keeps what the form does not show when only the description changes', () => {
      games('boardGames').then(before => {
        cy.visit('/admin/ludotheque');
        searchAndEdit('Tax the Rich');
        cy.fillField('Description', 'Description modifiée');
        cy.saveForm();
        cy.get('.mat-mdc-dialog-container').should('not.exist');
        games('boardGames').then(after => {
          expect(after['ludo343']['description']).to.eq('Description modifiée');
          for (const key of ['themes', 'cover', 'minAge', 'maxPlayers', 'yearPublished', 'weight', 'isNew', 'ref']) {
            expect(after['ludo343'][key], key).to.deep.eq(before['ludo343'][key]);
          }
        });
      });
    });

    it('refuses a reference that already exists', () => {
      openForm('/admin/ludotheque', 'Jeux de société');
      cy.fillField('Nom', 'Doublon');
      cy.fillField('Référence', 'ludo343');
      cy.formField('Catégorie').find('mat-select').click();
      cy.contains('mat-option', 'Duo').click();
      cy.get('.mat-mdc-dialog-container mat-error').should('contain.text', 'existe déjà');
      cy.contains('.mat-mdc-dialog-actions button', 'Enregistrer').should('be.disabled');
    });

    it('does not leave an orphan entry when an image was uploaded and the form is cancelled', () => {
      cy.stubCloudinary();
      openForm('/admin/ludotheque', 'Jeux de société');
      cy.fillField('Nom', 'Zz Orphelin');
      cy.fillField('Référence', 'zzupload1');
      cy.formField('Catégorie').find('mat-select').click();
      cy.contains('mat-option', 'Duo').click();
      cy.get('input[type=file]').selectFile({contents: Cypress.Buffer.from('fake image'), fileName: 'cover.png', mimeType: 'image/png'}, {force: true});
      cy.contains('.mat-mdc-dialog-container button', 'Upload').click();
      cy.wait('@cloudinaryUpload');
      cy.contains('.cover-note', 'Image envoyée');
      cy.contains('.mat-mdc-dialog-actions button', 'Annuler').click();
      games('boardGames').then(stored => {
        expect(stored).not.to.have.property('zzupload1');
      });
    });

    it('writes the uploaded image together with the item on save', () => {
      cy.stubCloudinary();
      openForm('/admin/ludotheque', 'Jeux de société');
      cy.fillField('Nom', 'Zz Image');
      cy.fillField('Référence', 'zzimage1');
      cy.formField('Catégorie').find('mat-select').click();
      cy.contains('mat-option', 'Duo').click();
      cy.get('input[type=file]').selectFile({contents: Cypress.Buffer.from('fake image'), fileName: 'cover.png', mimeType: 'image/png'}, {force: true});
      cy.contains('.mat-mdc-dialog-container button', 'Upload').click();
      cy.contains('.cover-note', 'Image envoyée');
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      games('boardGames').then(stored => {
        expect(stored['zzimage1']['cover']).to.eq('https://res.cloudinary.com/seo9axkp/image/upload/fake-test-cover.jpg');
      });
    });

    it('asks for a confirmation before deleting, and deletes once confirmed', () => {
      addTestGame();
      searchAndEdit('Zz Test');
      cy.contains('.mat-mdc-dialog-actions button', 'Supprimer').click();
      cy.get('app-confirm-modal').should('contain.text', 'Zz Test Jeu');
      cy.contains('app-confirm-modal button', 'Annuler').click();
      games('boardGames').then(stored => expect(stored).to.have.property('zztest1'));
      cy.contains('.mat-mdc-dialog-actions button', 'Supprimer').click();
      cy.contains('app-confirm-modal button', 'Supprimer').click();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      games('boardGames').then(stored => expect(stored).not.to.have.property('zztest1'));
    });
  });

  describe('video games', () => {
    it('files a game under an old console', () => {
      openForm('/admin/ludotheque', 'Jeux vidéo');
      cy.fillField('Nom', 'Zz Jeu Wii');
      cy.fillField('Référence', 'zzwii1');
      cy.formField('Console').find('mat-select').click();
      cy.contains('mat-option', 'Wii').click();
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      games('videoGames').then(stored => {
        expect(stored['zzwii1']).to.deep.include({name: 'Zz Jeu Wii', category: 'wii', type: 'GAME', libraryId: 'videoGames'});
      });
    });
  });

  describe('bricolage', () => {
    function addTestTool(): void {
      openForm('/admin/bricolage');
      cy.get('.mat-mdc-dialog-title').should('have.text', 'Ajouter un outil');
      cy.fillField('Nom', 'Zz Outil');
      cy.fillField('Référence', 'zz900');
      cy.formField('Catégorie').find('mat-select').click();
      cy.contains('mat-option', 'Bois').click();
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
    }

    it('moves a tool that changes category and reference, leaving no duplicate', () => {
      addTestTool();
      tools().then(stored => expect(stored['bois']['zz900']).to.deep.include({name: 'Zz Outil', categoryId: 'bois'}));
      searchAndEdit('Zz Outil');
      cy.fillField('Référence', 'zz901');
      cy.formField('Catégorie').find('mat-select').click();
      cy.contains('mat-option', 'Jardinage').click();
      cy.saveForm();
      cy.get('.mat-mdc-dialog-container').should('not.exist');
      tools().then(stored => {
        expect(stored['bois']).not.to.have.property('zz900');
        expect(stored['Jardinage']).not.to.have.property('zz900');
        expect(stored['Jardinage']['zz901']).to.deep.include({name: 'Zz Outil', categoryId: 'Jardinage'});
      });
    });

    it('edits the dimensions of a trailer and keeps its other fields', () => {
      tools().then(before => {
        const [key, trailer] = Object.entries(before['Remorques'])[0];
        cy.visit('/admin/bricolage');
        searchAndEdit(String(trailer['name']));
        cy.get('.form-section-title').should('contain.text', 'Dimensions');
        cy.fillField('Longueur', '3,20 m');
        cy.saveForm();
        cy.get('.mat-mdc-dialog-container').should('not.exist');
        tools().then(after => {
          expect(after['Remorques'][key]['dimensions']).to.deep.include({longueur: '3,20 m'});
          expect(after['Remorques'][key]['name']).to.eq(trailer['name']);
          expect(after['Remorques'][key]['cover']).to.eq(trailer['cover']);
        });
      });
    });
  });
});
