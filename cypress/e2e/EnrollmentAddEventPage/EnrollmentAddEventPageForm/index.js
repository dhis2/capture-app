import { Given, When, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';
import '../../sharedSteps';

const showAllEventsInProgramStage = () => {
    cy.get('[data-test="dhis2-uicore-tablefoot"]')
        .then(($footer) => {
            if ($footer.find('[data-test="show-more-button"]').length > 0) {
                $footer.find('[data-test="show-more-button"]')
                    .click();
                showAllEventsInProgramStage();
            }
        });
};

Given('you open the main page with Ngelehun and Malaria focus investigation context', () => {
    cy.visit('/#/?orgUnitId=DiszpKrYNg8&programId=M3xtLkYBlKI');
});

Given(/^you land on the enrollment new event page by having typed (.*)$/, (url) => {
    cy.visit(url);
});

Given('you select the schedule tab', () => {
    cy.get('[data-test="new-event-schedule-tab"]')
        .click();
});

When('you add a comment to the event', () => {
    cy.get('[data-test="comment-textfield"]')
        .type('This is a comment')
        .blur();

    cy.get('[data-test="add-comment-btn"]')
        .click();
});

And('the events saves successfully', () => {
    cy.intercept('POST', '**/tracker?async=false').as('postEvent');

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Schedule')
        .click();

    cy.wait('@postEvent')
        .its('response.statusCode')
        .should('eq', 200);
});

When(/^you click the create new button number (.*)$/, (eq) => {
    cy.get('[data-test="create-new-button"]')
        .eq(eq)
        .click();
});

When(/^you type (.*) in the input number (.*)$/, (value, eq) => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(eq)
        .type(value)
        .blur();
});

When(/^you select (.*) in the select number (.*)$/, (value, eq) => {
    cy
        .get('[data-test="new-enrollment-event-form"]')
        .get('[data-test="virtualized-select"]')
        .eq(eq)
        .click()
        .contains(value)
        .click();
});

When(/^you click the checkbox number (.*)$/, (eq) => {
    cy.get('input[type="radio"]')
        .eq(eq)
        .click();
});

When(/^you click the button to (.*) without post request/, (buttonText) => {
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains(buttonText)
        .click();
});

When('the enrollment overview is finished loading', () => {
    cy.get('[data-test="dhis2-uicore-circularloader"]').should('not.exist');
    cy.get('[data-test="dhis2-uicore-datatable"]')
        .within(() => {
            cy.get('[data-test="dhis2-uicore-datatablerow"]')
                .should('exist');
        });
});

When('the form is finished loading', () => {
    cy.contains('[data-test="dhis2-uicore-button"]', 'Save without completing')
        .should('exist');
});


Then('all events should be displayed', () => {
    showAllEventsInProgramStage();
});

Then(/^the newest event in datatable nr (.*) should contain (.*)$/, (eq, status) => {
    cy.get('[data-test="dhis2-uicore-datatable"]')
        .eq(eq)
        .within(() => {
            cy.get('[data-test="dhis2-uicore-datatablerow"]')
                .filter(':contains("2021-10-15")')
                .last()
                .within(() => {
                    cy.contains(status);
                    cy.contains('Ngelehun CHC');
                });
        });
    cy.contains('[data-test="stage-content"]', 'Last updated a few seconds ago')
        .should('exist');
});

When(/^the user selects (.*)$/, (value) => {
    cy.get('.Select')
        .type(value.slice(0, -1));
    cy.contains(value)
        .click();
});

When(/^you focus and blur a required field/, () => {
    cy.get('[data-test="capture-ui-input"]')
        .eq(1)
        .focus()
        .blur();
});

Then(/^the input should throw an error with error-message (.*)$/, (error) => {
    cy.get('[data-test="error-message"]')
        .contains(error);
});


Then('there should be a modal popping up', () => {
    cy.contains('[data-test="modal-ask-to-create-new"]', 'Generate new event')
        .should('exist');
});

When(/^you choose option (.*) in the modal$/, (buttonText) => {
    cy.get('[data-test="modal-ask-to-create-new"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains(buttonText)
        .click();
});

Then(/^you will be navigate to page (.*)$/, (url) => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/${url}`);
});

Then('the user clicks the first second antenatal care visit event', () => {
    cy.contains('[data-test="stage-content"]', 'Last updated a few seconds ago')
        .should('exist');
});
