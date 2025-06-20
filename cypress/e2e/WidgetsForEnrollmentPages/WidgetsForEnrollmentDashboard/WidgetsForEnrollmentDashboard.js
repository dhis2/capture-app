import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import moment from 'moment';
import '../sharedSteps';
import '../WidgetEnrollment';
import '../WidgetProfile';
import '../WidgetEnrollmentNote';

When('the user sets the birthday date to the current date', () => {
    cy.get('[data-test="modal-edit-profile"]').find('input[type="text"]').eq(8).clear()
        .blur()
        .type(moment().format('YYYY-MM-DD'))
        .blur();
});

When(/^the user sets the first name to (.*)$/, (name) => {
    cy.get('[data-test="modal-edit-profile"]').find('input[type="text"]').eq(1).clear()
        .blur()
        .type(name)
        .blur();
});

When('the user clicks the save button', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false',
    }).as('postTrackedEntityInstance');
    cy.get('[data-test="modal-edit-profile"]').within(() => {
        cy.get('[data-test="dhis2-uicore-button"]').eq(1).click();
    });
    cy.wait('@postTrackedEntityInstance');
});

Then('the user can see the program rules effect in the indicator widget', () => {
    cy.get('[data-test="indicator-widget"]').contains('Measles + Yellow fever doses');
});

Then(/^the profile widget attributes list contains the text (.*)$/, (name) => {
    cy.get('[data-test="profile-widget"]').within(() => {
        cy.get('[data-test="widget-contents"]').should('be.visible');
        cy.get('[data-test="profile-widget-flatlist"]').should('be.visible');
        cy.contains('First name').should('exist');
        cy.contains(name).should('exist');
    });
});

Then(/^the scope selector list contains the text (.*)$/, (name) => {
    cy.get('[data-test="scope-selector"]').within(() => {
        cy.contains('Person').should('exist');
        cy.contains(name).should('exist');
    });
});

When(/^the user clicks the "Enrollment dashboard" breadcrumb item/, () =>
    cy.get('[data-test="enrollment-breadcrumb-overview-item"]')
        .click(),
);
