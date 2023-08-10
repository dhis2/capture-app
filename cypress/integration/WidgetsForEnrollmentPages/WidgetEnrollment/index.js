const { getCurrentYear } = require('../../../support/date');

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

Then('the user sees the enrollment date', () => {
    cy.get('[data-test="widget-enrollment-enrollment-date"]').within(() => {
        cy.get('[data-test="widget-enrollment-icon-calendar"]').should('exist');
        cy.get('[data-test="widget-enrollment-date"]')
            .contains(`Date of enrollment: ${getCurrentYear()}-08-01`)
            .should('exist');
    });
});

Then('the user sees the incident date', () => {
    cy.get('[data-test="widget-enrollment-incident-date"]').within(() => {
        cy.get('[data-test="widget-enrollment-date"]')
            .contains(`Date of birth: ${getCurrentYear()}-08-01`)
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

When('the user opens the enrollment actions menu', () => {
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-actions-button"]').click();
    });
    cy.intercept({
        method: 'PUT',
        url: '**/enrollments/wBU0RAsYjKE',
    }).as('putEnrollment');
});

When(/^the user changes the enrollment status to (.*)$/, (status) => {
    cy.get(`[data-test="widget-enrollment-actions-${status}"]`).click();
    cy.wait('@putEnrollment');
});

Then(/^the user sees the enrollment status is (.*)$/, status =>
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-status"]')
            .contains(status)
            .should('exist');
    }),
);

When(/^the user (.*) the enrollment for followup/, (action) => {
    cy.get(
        `[data-test="widget-enrollment-actions-followup-${action}"]`,
    ).click();
    cy.wait('@putEnrollment');
});

Then(/^the user can see the enrollment is ?(.*) marked for follow up/, not =>
    cy.get('[data-test="widget-enrollment"]').within(() => {
        cy.get('[data-test="widget-enrollment-status"]')
            .contains('Follow-up')
            .should(not ? 'not.exist' : 'exist');
    }),
);

When(/^the user clicks on the delete action/, () =>
    cy.get('[data-test="widget-enrollment-actions-delete"]').click(),
);

Then(/^the user sees the delete enrollment modal/, () =>
    cy.get('[data-test="widget-enrollment-actions-modal"]').within(() => {
        cy.contains('Delete enrollment').should('exist');
        cy.contains(
            'Are you sure you want to delete this enrollment? This will permanently remove the current enrollment.',
        ).should('exist');
        cy.contains('No, cancel').should('exist');
        cy.contains('Yes, delete enrollment').should('exist');
    }),
);
