import '../sharedSteps';

beforeEach(() => {
    cy.loginThroughForm();
});

Then('the program stages should be displayed', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .within(() => {
            cy.contains('Birth').should('exist');
            cy.contains('Baby Postnatal').should('exist');
        });
});

When('you click the stages and events widget toggle open close button', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .within(() => {
            cy.get('[data-test="widget-open-close-toggle-button"]')
                .first()
                .click();
        });
});

Then('the stages and events widget should be closed', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .within(() => {
            cy.get('[data-test="widget-contents"]')
                .children()
                .should('not.exist');
            cy.contains('Birth').should('not.exist');
        });
});

Then('you see the first 5 events in the table', () => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="widget-contents"]').should('exist');
        cy.get('[data-test="widget-contents"]').find('[data-test="stage-content"]').should('have.length', 5);
        cy.get('[data-test="stage-content"]').eq(2).contains('Antenatal care visit').should('exist');
    });
});

Then('you see the first 5 rows in Antenatal care visit event', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .find('[data-test="stage-content"]')
        .eq(2)
        .within(() => {
            cy.get('[data-test="dhis2-uicore-datatable"]').should('exist');
            cy.get('[data-test="dhis2-uicore-tablebody"]')
                .find('[data-test="dhis2-uicore-datatablerow"]').should('have.length', 5);
        });
});

Then('you see buttons in the footer list', () => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="view-all-button"]').should('exist');
        cy.get('[data-test="show-more-button"]').should('exist');
        cy.get('[data-test="create-new-button"]').should('exist');
    });
});

When('you click show more button in stages&event list', () => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="show-more-button"]').click();
    });
});

Then('more events should be displayed', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .find('[data-test="stage-content"]')
        .eq(2)
        .within(() => {
            cy.get('[data-test="dhis2-uicore-datatable"]').should('exist');
            cy.get('[data-test="dhis2-uicore-tablebody"]')
                .find('[data-test="dhis2-uicore-datatablerow"]').should('have.length', 10);
        });
});

Then('reset button should be displayed', () => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="view-all-button"]').should('exist');
        cy.get('[data-test="show-more-button"]').should('exist');
        cy.get('[data-test="reset-button"]').should('exist');
        cy.get('[data-test="create-new-button"]').should('exist');
    });
});

And('you click reset button', () => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="reset-button"]').click();
        cy.wait(100);
    });
});

Then('there should be 5 rows in the table', () => {
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .find('[data-test="stage-content"]')
        .eq(2)
        .within(() => {
            cy.get('[data-test="dhis2-uicore-datatable"]').should('exist');
            cy.get('[data-test="dhis2-uicore-tablebody"]')
                .find('[data-test="dhis2-uicore-datatablerow"]').should('have.length', 5);
        });
});
