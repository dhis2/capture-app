import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(/^user lands on the Enrollment dashboard page by typing (.*)$/, url =>
    cy.visit(url),
);

Given(/^user lands on the EnrollmentEventNew-page without a stageId by typing (.*)$/, url =>
    cy.visit(url),
);

Given('there are four program stages', () => {
    cy.get('[data-test=stage-content]').should('have.length', 4);
});

Given('one of the program stages is non-repeatable', () => {
    cy.get('[data-test=create-new-button]').should('have.length', 4);
    cy.get('[data-test=create-new-button]').eq(1).should('be.disabled');
});

When('the user clicks the Care at birth program stage button', () => {
    cy.get('[data-test=program-stage-selector-button]')
        .eq(2)
        .should('contain', 'Care at birth')
        .click();
});

Then(/^the URL should contain stageId (.*)$/, stageId =>
    cy.url()
        .should('include', stageId),
);

Then('the stage-button should be disabled', () => {
    cy.get('[data-test=program-stage-selector-button]')
        .eq(0)
        .should('be.disabled');
});

Then('only three program stages are displayed in the stage selector widget', () => {
    cy.get('[data-test=program-stage-selector-button]').should('have.length', 3);
});

Then('the New event quick action button is disabled', () => {
    cy.get('[data-test=quick-action-button-report]').should('be.disabled');
});
