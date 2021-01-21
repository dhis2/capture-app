beforeEach(() => {
    cy.loginThroughForm();
});

Given('you open the main page with Ngelehun and child programme context', () => {
    cy.visit('#/programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

Then('the default working list should be displayed', () => {
    const names = [
        'John Kelly',
        'Anna Jones',
        'Maria Wright',
        'Joe Riley',
        'Anthony Banks',
        'Alan West',
        'Heather Greene',
        'Andrea Burton',
        'Donald Johnson',
        'Frances Rodriguez',
        'Julia Harrison',
        'Elizabeth Alvarez',
        'Donald Williams',
        'Wayne Roberts',
        'Johnny Lynch',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

Then('rows per page should be set to 15', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .contains('15')
        .should('exist');
});
Then('the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

When('you select the working list called completed enrollments', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Completed enrollments')
        .click();
});


Then('the list should display teis with a completed enrollment', () => {
    const names = [
        'Filona Ryder',
        'Frank Fjordsen',
        'Gertrude Fjordsen',
        'Alan Thompson',
        'Emma Johnson',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 6)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

Then('the enrollment status filter button should show that the completed filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Completed')
        .should('exist');
});

When('you set the enrollment status filter to completed', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Completed')
        .click();
});

When('you apply the current filter', () => {
    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

When('you set the enrollment status filter to active', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Active')
        .click();
});

When('you set the assginee filter to none', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('None')
        .click();
});

Then('the enrollment status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
});

Then('the assignee filter button should show that unassigned filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to: None')
        .should('exist');
});

Then('the list should display teis with a completed enrollment and unassinged events', () => {
    const names = [
        'John Kelly',
        'Anna Jones',
        'Maria Wright',
        'Joe Riley',
        'Anthony Banks',
        'Alan West',
        'Heather Greene',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 8)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you set the first name filter to John', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('More filters')
        .click();

    cy.get('[data-test="tei-working-lists"]')
        .find('li')
        .contains('First name')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .find('input')
        .type('John')
        .blur();
});

Then('the first name filter button should show that the filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('First name: John')
        .should('exist');
});

Then('the list should display teis with John as the first name', () => {
    const names = [
        'John Kelly',
        'Johnny Lynch',
        'John Thomson',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 4)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});


When('you open the column selector', () => {
    cy.get('button[title="Select columns"]')
        .click();
});

When('you select the registering unit and save from the column selector', () => {
    cy.get('div[role="dialog"]')
        .contains('Registering unit')
        .find('input')
        .click();

    cy.get('div[role="dialog"]')
        .contains('Save')
        .click();
});

Then('the registering unit should display in the list', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Registering unit')
        .should('exist');
});

When('you click the next page buttton', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .click();
});

Then('the list should display data for the second page', () => {
    const names = [
        'Donna Campbell',
        'Sharon Johnson',
        'Scott Hansen',
        'Emily Jones',
        'Alan Thompson',
        'Tom Johnson',
        'Jack Dean',
        'Tim Johnson',
        'James Dunn',
        'Noah Thompson',
        'Lily Matthews',
        'Olvia Watts',
        'Emma Thompson',
        'Sophia Jackson',
        'Tom Johson',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

Then('the page navigation should show that you are on the second page', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Page 2')
        .should('exist');
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
    const names = [
        'John Kelly',
        'Anna Jones',
        'Maria Wright',
        'Joe Riley',
        'Anthony Banks',
        'Alan West',
        'Heather Greene',
        'Andrea Burton',
        'Donald Johnson',
        'Frances Rodriguez',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 11)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});

When('you click the first name column header', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('First name')
        .click();
});

Then('the sort arrow should indicate descending order', () => {
    cy.get('[data-test="data-table-desc-sort-icon"]')
        .should('exist');
});

Then('the list should display data ordered descendingly by first name', () => {
    const names = [
        'John Kelly',
        'Anna Jones',
        'Maria Wright',
        'Joe Riley',
        'Anthony Banks',
        'Alan West',
        'Heather Greene',
        'Andrea Burton',
        'Donald Johnson',
        'Frances Rodriguez',
        'Julia Harrison',
        'Elizabeth Alvarez',
        'Donald Williams',
        'Wayne Roberts',
        'Johnny Lynch',
    ];

    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('have.length', 16)
        .each(($teiRow, index) => {
            if (index) {
                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[0])
                    .should('exist');

                cy.wrap($teiRow)
                    .contains(names[index - 1].split(' ')[1])
                    .should('exist');
            }
        });
});
