describe('Test admin ludotheque', () => {
  it('login as admin', () => {
    cy.visit('/iWantToConfigureThisAwesomeApp');
    cy.wait(2000);

    // CRUD BoardGame
    cy.visit('/ludotheque/admin/games');
    cy.get('#addGame').click();
    cy.get('.ng-tns-c154-7 > .mat-mdc-form-field-infix').click();
    cy.get('#mat-input-0').type('Terraforming Mars');
    cy.get('#mat-input-1').type('ludoTestTest');
    cy.get('.mat-mdc-select-placeholder').click();
    cy.get('.cdk-overlay-transparent-backdrop').click();
    cy.get('.mat-mdc-select-placeholder').click();
    cy.get('#mat-option-1').click();
    cy.get('.ng-tns-c154-12 > .mat-mdc-form-field-infix').click();
    cy.get('#mat-input-3').type('167791');
    cy.get('#makeMagic').click();
    cy.wait(10000);
    cy.get('#save').click();
    cy.wait(1000);
    cy.get('#editGame').click();
    cy.get('#mat-input-11').type('Terraforming Mars').type('{enter}');
    cy.get('#mat-input-12').should('have.value', 'Terraforming Mars');
    cy.get('#mat-input-13').should('have.value', 'ludoTestTest');
    cy.get('#mat-input-15').should('have.value', '167791');
    cy.get('#mat-input-17').should('have.value', '1');
    cy.get('#mat-input-18').should('have.value', '5');
    cy.get('#mat-input-19').should('have.value', '12');
    cy.get('#mat-input-20').should('have.value', '120');
    cy.get('#mat-input-21').should('have.value', '12');
    cy.get('#delete').click();
  });
})
