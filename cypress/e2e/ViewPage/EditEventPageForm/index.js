import { Given, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
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
