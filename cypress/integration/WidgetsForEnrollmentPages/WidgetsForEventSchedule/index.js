import '../sharedSteps';
import '../WidgetTab';

Then('you choose a schedule date', () => {
    cy.get('[data-test="schedule-section"]').within(() => {
        cy.get("[data-test='capture-ui-input']").eq(0).should('have.value', '2022-08-01');
        cy.get("[data-test='capture-ui-input']").eq(0)
            .clear()
            .type('2023-08-01')
            .blur();
    });
});

When('you click cancel in Schedule tab', () => {
    cy.get('[data-test="dhis2-uicore-button"]').contains('Cancel').click();
});

