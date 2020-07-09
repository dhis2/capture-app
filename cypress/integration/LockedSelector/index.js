Given('you are in the main page with no selections made', () => {
    cy.visit('/');
    cy.get('[data-test="dhis2-capture-new-button"]')
        .should('exist');
});

When('you click the "New" button to add a new event', () => {
    cy.get('[data-test="dhis2-capture-new-button"]')
        .click();
});

Then('text should inform you to select both organisation unit and program', () => {
    cy.get('[data-test="dhis2-capture-paper"]')
        .find('[data-test="dhis2-capture-paper-text"]')
        .should('exist');
});

Given('you are in the main page with organisation unit pre-selected', () => {
    cy.visit('/#/orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="dhis2-capture-new-button"]')
        .should('exist');
});

Then('text should inform you to select program', () => {
    cy.get('[data-test="dhis2-capture-paper"]')
        .find('[data-test="dhis2-capture-paper-text"]')
        .should('exist');
});

Given('you are in the main page with program unit pre-selected', () => {
    cy.visit('/#/orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="dhis2-capture-new-button"]')
        .should('exist');
});

Given('you select both org unit and program', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/orgUnitId=DiszpKrYNg8`);

    cy.get('.Select')
        .type('Malaria case re');
    cy.contains('Malaria case registration')
        .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8`);
});

When('you click the "Start again" button', () => {
    cy.get('[data-test="dhis2-capture-start-again-button"]')
        .click();
});

Then('you should be taken to the main page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/`);
});

Then('you should see the table', () => {
    cy.get('tbody')
        .find('tr')
        .should('exist')
        .its('length')
        .should('eq', 15);
});

Then('you can see the new event page', () => {
    cy.get('[data-test="dhis2-capture-start-again-button"]')
        .should('exist');
});

Given('you select the first entity from the table', () => {
    cy.get('tbody')
        .find('tr')
        .first()
        .click();
});

Then('you can see the view event page', () => {
    cy.url().should('include', 'viewEvent/');
});
