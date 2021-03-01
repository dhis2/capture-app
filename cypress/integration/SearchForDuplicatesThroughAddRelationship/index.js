import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

And('you fill in the first name with values that have duplicates', () => {
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .wait(500)
        .type('Tesmi')
        .blur();
});

And('you fill in the first name with values that have less than 5 duplicates', () => {
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .type('Sarah')
        .blur();
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Fis')
        .blur();
});

And('you fill in the first name with values that have exactly 5 duplicates', () => {
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .wait(500)
        .type('Tesmi')
        .blur();
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .find('[data-test="capture-ui-input"]')
        .eq(2)
        .type('Abel')
        .blur();
});

When('you click create', () => {
    cy.get('[data-test="dhis2-capture-possible-duplicates-found-button"]')
        .should('exist');

    cy.get('[data-test="dhis2-capture-create-and-link-button"]')
        .click();
});

When('you click the show possible duplicates button', () => {
    cy.get('[data-test="dhis2-capture-possible-duplicates-found-button"]')
        .click();
});


And('you can see a modal', () => {
    cy.get('[data-test="dhis2-capture-duplicates-modal"]')
        .should('exist');
});

And('you can see an empty page', () => {
    cy.contains('No results found')
        .should('exist');
});
