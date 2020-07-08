Given('you are in the main page with no selections made', () => {
    cy.visit('/');
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('New')
        .should('exist');
});
When('you click the "New" button to add a new event', () => {
    cy.get('[data-test="dhis2-uicore-button"]').contains('New').click();
});
Then('text should inform you to select both organisation unit and program', () => {
    cy.get('[data-test="dhis2-capture-paper"]')
        .contains('Select a registering unit and program above to get started')
        .should('exist');
});


Given('you are in the main page with organisation unit selected', () => {
    cy.visit('/#/orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('New')
        .should('exist');
});
Then('text should inform you to select program', () => {
    cy.get('[data-test="dhis2-capture-paper"]')
        .contains('Select a program to start reporting')
        .should('exist');
});
