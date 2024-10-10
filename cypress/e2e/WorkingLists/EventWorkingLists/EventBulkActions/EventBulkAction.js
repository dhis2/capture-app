import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import '../../sharedSteps';

Given('you open the main page with Ngelehun and malaria case context', () => {
    cy.visit('#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When(/^you select the first (.*) rows$/, (rows) => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .each(($tr, index) => {
            if (index < rows) {
                cy.wrap($tr).find('[data-test="select-row-checkbox"]').click();
            }
        });
});

Then(/^the bulk action bar should say (.*) selected$/, (rows) => {
    cy.get('[data-test="bulk-action-bar"]')
        .contains(`${rows} selected`);
});

Then(/^the first (.*) rows should be selected$/, (rows) => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .each(($tr, index) => {
            if (index < rows) {
                cy.wrap($tr)
                    .should('have.class', 'selected')
                    .find('[data-test="select-row-checkbox"]');
            }
        });
});

// you select all rows
When('you select all rows', () => {
    cy.get('[data-test="select-all-rows-checkbox"]').click();
});

Then('all rows should be selected', () => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .each(($tr) => {
            cy.wrap($tr)
                .should('have.class', 'selected')
                .find('[data-test="select-row-checkbox"]');
        });
});

Then('the bulk action bar should not be present', () => {
    cy.get('[data-test="bulk-action-bar"]').should('not.exist');
});

Then('no rows should be selected', () => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .each(($tr) => {
            cy.wrap($tr).should('not.have.class', 'selected');
        });
});

When(/^you deselect the first (.*) rows$/, (rows) => {
    cy.get('[data-test="dhis2-uicore-tablebody"]')
        .find('tr')
        .each(($tr, index) => {
            if (index < rows) {
                cy.wrap($tr).find('[data-test="select-row-checkbox"]').click();
            }
        });
});

Then('the filters should be disabled', () => {
    cy.get('[data-test="workinglist-template-selector-chip"]')
        .each(($chip) => {
            cy.wrap($chip).should('have.class', 'disabled');
        });
});

Then('the bulk complete modal should open', () => {
    cy.get('[data-test="bulk-complete-events-dialog"]')
        .should('exist');
});

When('you click the confirm complete events button', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false**',
    }, {
        statusCode: 200,
        body: {},
    }).as('completeEvents');

    cy.get('[data-test="bulk-complete-events-dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Complete').click();

    cy.wait('@completeEvents')
        .its('request.body')
        .should(({ events }) => {
            expect(events).to.have.length(3);
            expect(events[0]).to.include({ event: 'a969f7a3bf1', status: 'COMPLETED' });
            expect(events[1]).to.include({ event: 'a6f092d0d44', status: 'COMPLETED' });
            expect(events[2]).to.include({ event: 'a5e67163090', status: 'COMPLETED' });
        });
});

Then('the bulk complete modal should close', () => {
    cy.get('[data-test="bulk-complete-events-dialog"]')
        .should('not.exist');
});

When(/^you click the bulk (.*) button$/, (text) => {
    cy.get('[data-test="bulk-action-bar"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains(text, { matchCase: false })
        .click();
});

Then('the bulk delete modal should open', () => {
    cy.get('[data-test="bulk-delete-events-dialog"]')
        .should('exist');
});

// you click the confirm delete events button
When('you click the confirm delete events button', () => {
    cy.intercept({
        method: 'POST',
        url: '**/tracker?async=false**',
    }, {
        statusCode: 200,
        body: {},
    }).as('deleteEvents');

    cy.get('[data-test="bulk-delete-events-dialog"]')
        .find('[data-test="dhis2-uicore-button"]')
        .contains('Delete').click();

    cy.wait('@deleteEvents')
        .its('request.body')
        .should(({ events }) => {
            expect(events).to.have.length(3);
            expect(events).to.deep.include({ event: 'a969f7a3bf1' });
            expect(events).to.deep.include({ event: 'a6f092d0d44' });
            expect(events).to.deep.include({ event: 'a5e67163090' });
        });
});

Then('the bulk delete modal should close', () => {
    cy.get('[data-test="bulk-delete-events-dialog"]')
        .should('not.exist');
});
