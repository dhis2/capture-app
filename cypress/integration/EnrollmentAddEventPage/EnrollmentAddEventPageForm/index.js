import '../sharedSteps';

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

When(/^you opt in to use the new enrollment Dashboard for (.*)$/, (program) => {
    cy.get('[data-test="main-page-working-list"]').then(($wrapper) => {
        if ($wrapper.find('[data-test="opt-in"]').length > 0) {
            cy.contains('[data-test="dhis2-uicore-button"]', `Opt in for ${program}`).click();
            cy.contains('[data-test="dhis2-uicore-button"]', 'Yes, opt in').click();
            cy.contains('[data-test="dhis2-uicore-button"]', `Opt out for ${program}`);
        }
    });
});

Given(/^you land on the enrollment new event page by having typed (.*)$/, (url) => {
    cy.visit(url);
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

When(/^you click the (.*) button/, (buttonText) => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false',
    }).as('postEvents');

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains(buttonText)
        .click();

    cy.wait('@postEvents');
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
    cy.contains('[data-test="dhis2-uicore-modal"]', 'Generate new event')
        .should('exist');
});

When(/^you choose option (.*) in the modal$/, (buttonText) => {
    cy.get('[data-test="dhis2-uicore-modal"]')
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
