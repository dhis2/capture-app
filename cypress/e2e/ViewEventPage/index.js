import {
    Given,
    When,
    Then,
    When as And,
    After,
} from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

After({ tags: '@with-event-coc-clean-up' }, () => {
    cy.visit('/#/viewEvent?viewEventId=pFm7eAXCthw');

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Edit event')
        .click();

    cy.get('[data-test="dataEntrySection-categorycombo"]')
        .within(() => {
            cy.get('[data-test="virtualized-select"]')
                .eq(0)
                .click()
                .contains('AIDSRelief Consortium')
                .click({ force: true });
        });

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
});

Given(/^you land on the view event page with event id: (.*)$/, (eventId) => {
    cy.visit(`/#/viewEvent?viewEventId=${eventId}`);
});

Then('the event details page displays the category combination', () => {
    cy.get('[data-test="dataEntrySection-categorycombo"]')
        .contains('AIDSRelief Consortium');
});

And('you enable edit mode', () => {
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Edit event')
        .click();
});

When('you change the category combination and save', () => {
    cy.get('[data-test="dataentry-field-attributeCategoryOptions-LFsZ8v5v7rq"]')
        .within(() => {
            cy.get('[data-test="virtualized-select"]')
                .eq(0)
                .click()
                .contains('CARE International')
                .click({ force: true });
        });

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
});

Then('the event details page displays the updated category combination', () => {
    cy.get('[data-test="dataEntrySection-categorycombo"]')
        .contains('CARE International');
});
