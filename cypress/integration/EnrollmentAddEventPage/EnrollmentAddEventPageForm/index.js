
beforeEach(() => {
    cy.loginThroughForm();
});

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
