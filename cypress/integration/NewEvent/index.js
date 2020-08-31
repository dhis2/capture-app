Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.loginThroughForm();
    cy.visit('/#/newEvent/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you add data to the form', () => {
    cy.get('[data-test="dhis2-capture-dataentry-field-eventDate"]', { timeout: 30000 })
        .find('input')
        .type('2020-01-01')
        .blur();

    cy.get('[data-test="dhis2-capture-form-field-qrur9Dvnyt5"]')
        .find('input')
        .type('25');

    cy.get('[data-test="dhis2-capture-form-field-oZg33kd9taw"]')
        .find('input')
        .type('Male{enter}', { force: true });
});

When('you sumbit the form', () => {
    cy.server();
    cy.route('POST', '**/events').as('postEvent');
    cy.get('[data-test="dhis2-uicore-splitbutton-button"]')
        .click();
});

Then('the event should successfully be sent to the server', () => {
    cy.wait('@postEvent');
    cy.get('@postEvent').should('have.property', 'status', 200);
});
