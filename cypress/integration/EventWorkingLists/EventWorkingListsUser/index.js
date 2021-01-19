beforeEach(() => {
    cy.loginThroughForm();
});

Given('you open the main page with Ngelehun and malaria case context', () => {
    cy.visit('#/programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

Then('the default working list should be displayed', () => {
    const rows = [
        '14 Male',
        '67 Male',
        '66 Male',
        '55 Male',
        '26 Female',
        '35 Male',
        '49 Male',
        '60 Male',
        '12 Male',
        '61 Male',
        '27 Female',
        '20 Male',
        '69 Male',
        '11 Male',
        '59 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

Then('the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

When('you select the working list called events assigned to anyone', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events assigned to anyone')
        .click();
});

Then('the assigned to filter button should show that the anyone filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to: Anyone')
        .should('exist');
});

Then('the list should display events assigned to anyone', () => {
    const rows = [
        '14 Male Milla',
        '67 Male Milla',
        '25 Female Milla',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[2])
                    .should('exist');
            }
        });
});

When('you set the assignee filter to anyone', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Anyone')
        .click();
});

When('you apply the current filter', () => {
    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the assigned to filter button should show that the anyone filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to: Anyone')
        .should('exist');
});

Then('rows per page should be set to 15', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .contains('15')
        .should('exist');
});

When('you set the status filter to active', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Active')
        .click();
});

Then('the assigned to filter button should show that the anyone filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to: Anyone')
        .should('exist');
});

Then('the status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Status: Active')
        .should('exist');
});

Then('the list should display active events that are assigned to anyone', () => {
    const rows = [
        '14 Male Milla',
        '67 Male Milla',
        '25 Female Milla',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[2])
                    .should('exist');
            }
        });
});

When('you set the age filter to 10-20', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years)')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Min"]')
        .type('10');

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input[placeholder="Max"]')
        .type('20');
});

Then('the age filter button should show that the filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years): 10 to 20')
        .should('exist');
});

Then('the list should display events where age is between 10 and 20', () => {
    const rows = [
        '14 Male',
        '12 Male',
        '20 Male',
        '11 Male',
        '19 Male',
        '15 Female',
        '14 Male',
        '20 Female',
        '20 Male',
        '18 Male',
        '18 Female',
        '11 Female',
        '10 Male',
        '11 Female',
        '11 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you open the column selector', () => {
    cy.get('button[title="Select columns"]')
        .click();
});

When('you select Household location and save from the column selector', () => {
    cy.get('div[role="dialog"]')
        .contains('Household location')
        .find('input')
        .click();

    cy.get('div[role="dialog"]')
        .contains('Save')
        .click();
});

Then('Household location should display in the list', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Household location')
        .should('exist');
});

When('you click the next page buttton', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .click();
});

Then('the page navigation should show that you are on the second page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

Then('the list should display data for the second page', () => {
    const rows = [
        '19 Male',
        '56 Female',
        '61 Male',
        '9 Male',
        '15 Female',
        '2 Male',
        '55 Female',
        '14 Male',
        '8 Female',
        '70 Male',
        '22 Male',
        '4 Male',
        '2 Male',
        '28 Female',
        '44 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you click the previous page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-previous-page"]')
        .click();
});

When('you click the first page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-first-page"]')
        .click();
});

When('you change rows per page to 10', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .click()
        .contains('10')
        .click();
});

Then('the list should display 10 rows of data', () => {
    const rows = [
        '14 Male',
        '67 Male',
        '66 Male',
        '55 Male',
        '26 Female',
        '35 Male',
        '49 Male',
        '12 Male',
        '60 Male',
        '61 Male',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 11)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you click the report date column header', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Report date')
        .click();
});

Then('the sort arrow should indicate ascending order', () => {
    cy.get('[data-test="data-table-asc-sort-icon"]')
        .should('exist');
});

Then('the list should display data ordered descendingly by report date', () => {
    const rows = [
        '14 Female',
        '63 Male',
        '4 Female',
        '37 Male',
        '68 Female',
        '27 Male',
        '45 Female',
        '9 Male',
        '59 Male',
        '50 Female',
        '62 Female',
        '66 Male',
        '42 Female',
        '51 Female',
        '1 Female',
    ];

    cy.get('[data-test="event-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($row, index) => {
            if (index) {
                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($row)
                    .contains(rows[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});
