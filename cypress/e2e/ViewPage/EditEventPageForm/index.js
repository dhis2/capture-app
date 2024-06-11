import { Given, Then, When, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../../sharedSteps';

Given('you open the main page with Ngelehun and antenatal care context', () => {
    cy.visit('#/?programId=lxAQ7Zs9VYR&orgUnitId=DiszpKrYNg8');
});

And('you open the first event in the list', () => {
    cy.get('[data-test="online-list-table"]').within(() => {
        cy.get('[data-test="dhis2-uicore-tablebody"]')
            .find('tr')
            .eq(0)
            .click();
    });
});

And('you (incomplete)(complete) and save the event', () => {
    cy.contains('Edit event')
        .click();

    cy.get('[data-test="dataentry-field-complete"]')
        .find('input')
        .click()
        .blur();

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
});

Then(/^you are redirected to the main page and the event status (.*) is displayed in the list/, (status) => {
    cy.url().should('include', 'programId=lxAQ7Zs9VYR');
    cy.url().should('include', 'orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="online-list-table"]').within(() => {
        cy.get('[data-test="dhis2-uicore-tablebody"]')
            .find('tr')
            .eq(0)
            .contains(status);
    });
});

Given('you open an event in Ngelehun and malaria case context', () => {
    cy.visit('#/viewEvent?viewEventId=a93201a6a99');
});

When('you search for an existing unique id and link to the person', () => {
    cy.intercept('POST', '**/tracker?async=false', (req) => {
        if (req.body.relationships) {
            req.alias = 'postRelationshipData';
        }
    });

    cy.get('[data-test="form-field-lZGmxYbs97q"]')
        .find('input')
        .type('9191132445122')
        .blur();

    cy.get('[data-test="relationship-tei-search-button-relationshipTeiSearch-nEenWmSyUEp-0"]')
        .click();

    cy.get('[data-test="relationship-tei-link-vu9dsAuJ29q"]')
        .click();

    cy.wait('@postRelationshipData', { timeout: 20000 });
});

When('you click the delete relationship button', () => {
    cy.intercept('POST', '**/tracker?importStrategy=DELETE&async=false', (req) => {
        if (req.body.relationships) {
            req.alias = 'deleteRelationshipData';
        }
    });
    cy.get('[data-test="delete-relationship-button"]')
        .click();
});

Then('the relationship is deleted', () => {
    cy.wait('@deleteRelationshipData')
        .then((result) => {
            expect(result.response.statusCode).to.equal(200);
        });
});

