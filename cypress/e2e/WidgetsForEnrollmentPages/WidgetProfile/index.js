import { Then, Given, When } from '@badeball/cypress-cucumber-preprocessor';

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

Given('you add a new tracked entity in the Malaria focus investigation program', () => {
    cy.visit('/#/new?programId=M3xtLkYBlKI&orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="capture-ui-input"]')
        .eq(2)
        .type(`Local id-${Math.round((new Date()).getTime() / 1000)}`)
        .blur();
    cy.contains('Save focus area')
        .click();
    cy.url().should('include', 'enrollmentEventEdit?');
});

When('you open the overflow menu and click the "Delete Focus area" button', () => {
    cy.get('[data-test="widget-profile-overflow-menu"]')
        .click();
    cy.contains('Delete Focus area')
        .click();
});

Then('you see the delete tracked entity confirmation modal', () => {
    cy.get('[data-test="widget-profile-delete-modal"]').within(() => {
        cy.contains(
            'Are you sure you want to delete this Focus area? This will permanently remove the Focus area and all its associated enrollments and events in all programs.',
        ).should('exist');
    });
});

When('you confirm by clicking the "Yes, delete Focus area" button', () => {
    cy.get('[data-test="widget-profile-delete-modal"]').within(() => {
        cy.contains('Yes, delete Focus area')
            .click();
    });
});

Then('you are redirected to the home page', () => {
    cy.url().should('include', 'selectedTemplateId=M3xtLkYBlKI');
});

Then('the user sees the tracked entity type polygon geometry', () => {
    cy.get('[data-test="modal-edit-profile"]').within(() => {
        cy.contains('Area on map saved').should('exist');
        cy.contains('Edit area on map').should('exist');
    });
});
