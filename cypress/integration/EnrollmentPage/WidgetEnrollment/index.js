import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});
Given('you open the enrollment page', () => {
    cy.visit('#/enrollment?enrollmentId=wBU0RAsYjKE');
});

When('you click the enrollment widget toggle open close button', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-open-close-toggle-button"]').click();
    });
});

Then('the enrollment widget should be closed', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-contents"]').children().should('not.exist');
    });
});

Then('the enrollment widget should be opened', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-contents"]').children().should('exist');
    });
});

Then('the user sees the enrollment status', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-status"]')
            .contains('Active')
            .should('exist');
    });
});

Then('the user sees the enrollment date', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-calendar"]').should('exist');
        cy.get('[data-test="widget-enrollment-enrollment-date"]')
            .contains('Date of enrollment 8/1/2021')
            .should('exist');
    });
});

Then('the user sees the incident date', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-incident-date"]')
            .contains('Date of birth 8/1/2021')
            .should('exist');
    });
});
Then('the user sees the enrollment organisation unit', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-orgunit"]').should('exist');
        cy.get('[data-test="widget-enrollment-orgunit"]')
            .contains('Started at Ngelehun CHC')
            .should('exist');
    });
});

Then('the user sees the owner organisation unit', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-owner-orgunit"]').should(
            'exist',
        );
        cy.get('[data-test="widget-enrollment-owner-orgunit"]')
            .contains('Owned by Ngelehun CHC')
            .should('exist');
    });
});

Then('the user sees the last update date', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-clock"]').should('exist');
        cy.get('[data-test="widget-enrollment-last-update"]')
            .contains('Last updated')
            .should('exist');
    });
});
