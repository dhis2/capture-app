import '../../sharedSteps';

Given(/^you land on the enrollment event page by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="scope-selector"]').contains('Selected person');
});

When(/^the user clicks on the edit button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .eq(1)
        .click(),
);

When(/^the user clicks on the save button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click(),
);

When(/^the user clicks on the cancel button/, () =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Cancel')
        .click(),
);

When(/^the user set the apgar score to (.*)/, score =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .find('[data-test="capture-ui-input"]')
        .eq(1)
        .clear()
        .type(score)
        .blur(),
);

When(/^the user changes the gender to (.*)/, gender =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .get('[data-test="virtualized-select"]')
        .eq(0)
        .click()
        .contains(gender)
        .click(),
);

When(/^the user sets Plurality assessed to (.*)/, text =>
    cy
        .get('[data-test="widget-enrollment-event"]')
        .get('[data-test="virtualized-select"]')
        .eq(4)
        .click()
        .contains(text)
        .click(),
);
