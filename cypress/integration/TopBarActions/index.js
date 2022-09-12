import '../sharedSteps';

Given(/^you land on a enrollment page domain by having typed (.*)$/, (url) => {
    cy.visit(url);
    cy.get('[data-test="scope-selector"]').contains('Selected person');
});

When(/^the user clicks on the edit button/, () =>
    cy.get('[data-test="widget-enrollment-event"]').find('[data-test="dhis2-uicore-button"]').eq(1).click(),
);

Then('the user sees the warning popup', () => {
    cy.contains('Unsaved changes');
    cy.contains('Leaving this page will discard the changes you made to this event.');
});

When(/^the user set the WHOMCH Diastolic blood pressure to (.*)/, score =>
    cy.get('[data-test="new-enrollment-event-form"]').find('[data-test="capture-ui-input"]').eq(6).clear()
        .type(score)
        .blur(),
);
