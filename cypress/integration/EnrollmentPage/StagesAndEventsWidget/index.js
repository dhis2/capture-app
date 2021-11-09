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

And('you see the first 5 events in the table', () => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="widget-contents"]').should('exist');
        cy.get('[data-test="widget-contents"]').find('[data-test="stage-content"]').should('have.length', 5);
        cy.get('[data-test="stage-content"]').eq(2).contains('Antenatal care visit').should('exist');
    });
});

And('you see the first 5 rows in Antenatal care visit event', () => {
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

And('you see buttons in the footer list', () => {
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

Then('the default list should be displayed', () => {
    const rows = [
        '2020-07-13|Bumbeh MCHP',
        '2020-07-12|Bumbeh MCHP',
        '2020-07-11|Bumbeh MCHP',
        '2020-07-10|Bumbeh MCHP',
        '2020-07-09|Bumbeh MCHP',
    ];
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .find('[data-test="stage-content"]')
        .eq(2)
        .find('tbody')
        .find('tr')
        .should('have.length', 5)
        .each(($row, index) => {
            cy.wrap($row).contains(rows[index].split('|')[0])
                .should('exist');

            cy.wrap($row).contains(rows[index].split('|')[1])
                .should('exist');
        });
});

When(/^you sort list asc by (.*)$/, (columnName) => {
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .find('[data-test="stage-content"]')
        .eq(2)
        .find('thead')
        .find('th')
        .within(() => {
            cy.contains(columnName)
                .find('button')
                .click();
            cy.wait(100);
            cy.contains(columnName)
                .find('button')
                .click();
        });
});

Then('the sorted list by Report date asc should be displayed', () => {
    const rows = [
        '2020-07-13|Bumbeh MCHP',
        '2020-07-12|Bumbeh MCHP',
        '2020-07-11|Bumbeh MCHP',
        '2020-07-10|Bumbeh MCHP',
        '2020-07-09|Bumbeh MCHP',
    ];
    cy.get('[data-test="stages-and-events-widget"]')
        .find('[data-test="widget-contents"]')
        .find('[data-test="stage-content"]')
        .eq(2)
        .find('tbody')
        .find('tr')
        .should('have.length', 5)
        .each(($row, index) => {
            cy.wrap($row).contains(rows[index].split('|')[0])
                .should('exist');

            cy.wrap($row).contains(rows[index].split('|')[1])
                .should('exist');
        });
});

When(/^you click button Go to full (.*)$/, (stageName) => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="view-all-button"]').contains(stageName).should('exist');
        cy.get('[data-test="view-all-button"]').contains(stageName).click();
        cy.wait(100);
    });
});

Then('you should navigate to Program Stage list page', () => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/#/enrollment/stageEvents?programId=WSGAb5XwJ3Y&orgUnitId=DwpbWkiqjMy&stageId=edqlbukwRfQ`);
});

When(/^you click New (.*)$/, (stageName) => {
    cy.get('[data-test="stages-and-events-widget"]').within(() => {
        cy.get('[data-test="create-new-button"]').contains(stageName).should('exist');
        cy.get('[data-test="create-new-button"]').contains(stageName).click();
        cy.wait(100);
    });
});

Then(/^you should navigate to Add new page (.*)$/, (url) => {
    cy.url().should('eq', `${Cypress.config().baseUrl}/${url}`);
});

Given(/^you open the enrollment page by typing (.*)$/, url =>
    cy.visit(url),
);

Then(/^you should see the disabled button (.*)$/, (stageName) => {
    cy.contains('[data-test="create-new-button"]', stageName)
        .should('be.disabled');
});
