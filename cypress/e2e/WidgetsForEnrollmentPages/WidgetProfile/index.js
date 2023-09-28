import { Then } from '@badeball/cypress-cucumber-preprocessor';
import '../../sharedSteps';

Then('the profile details should be displayed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]', { timeout: 1000 }).should('be.visible');
            cy.get('[data-test="profile-widget-flatlist"]').should('be.visible');
            cy.contains('First name').should('exist');
            cy.contains('Anna').should('exist');
            cy.contains('Last name').should('exist');
            cy.contains('Jones').should('exist');
        });
});

Then('the widget profile should be closed', () => {
    cy.get('[data-test="profile-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]')
                .children()
                .should('not.exist');
        });
});

Then(/^the user sees the edit profile modal/, () =>
    cy.get('[data-test="modal-edit-profile"]').within(() => {
        cy.contains('Edit Person').should('exist');
        cy.contains(
            'Change information about this Person here. To change information about this enrollment, use the Edit button in the in the Enrollment box on this dashboard',
        ).should('exist');
        cy.contains('Save changes').should('exist');
        cy.contains('Cancel without saving').should('exist');
    }),
);
