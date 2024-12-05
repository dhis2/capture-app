import { Given, When, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';

Given(/^you land on the enrollment event page by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="person-selector-container"]').contains('Person');
});

Given('you open the enrollment page which has multiple events and stages', () => {
    cy.visit('#/enrollment?enrollmentId=ek4WWAgXX5i');
});

And('the widgets are done rendering', () => {
    cy.contains('[data-test=profile-widget]', 'Person profile');
});

When('the user clicks the first second antenatal care visit event', () => {
    cy.contains('[data-test="stage-content"]', 'Second antenatal care visit')
        .find('tbody>tr>td')
        .first()
        .click();
});

When(/^the user clicks the "Back to all stages and events" button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .eq(0)
        .click(),
);

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});

Then('the program stages should be displayed', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .within(() => {
            cy.contains('antenatal care visit').should('exist');
            cy.contains('Care at birth').should('exist');
        });
});
