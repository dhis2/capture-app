beforeEach(() => {
    cy.loginThroughForm();
});

Given('you open the main page with Ngelehun and child programme context', () => {
    cy.server();
    cy.route('GET', '**/trackedEntityInstances**').as('getDefaultTeis');

    cy.visit('#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

Then('teis should be retrieved from the api using the default query args', () => {
    cy.wait('@getDefaultTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'pageSize=15');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.trackedEntityInstances').as('teis');
});

Then('the first page of the default tei working list should be displayed', () => {
    cy.get('[data-test="tei-working-lists"]')
        .find('tr')
        .should('exist');

    cy.contains('Page 1')
        .should('exist');
});

When('you select the working list called Active enrollments', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Active enrollments')
        .should('exist');

    cy.route('GET', '**/trackedEntityInstances**').as('getTeisWithEnrollmentStatusActive');

    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Active enrollments')
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

When('you apply the enrollment status filter', () => {
    cy.route('GET', '**/trackedEntityInstances**').as('getTeisWithEnrollmentStatusActive');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the enrollment status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
});

Then('teis with an active enrollment should be retrieved from the api', () => {
    cy.wait('@getTeisWithEnrollmentStatusActive', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'programStatus=ACTIVE');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.trackedEntityInstances').as('teis');
});

When('you set the assginee filter to none', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('None')
        .click();
});

When('you apply the assignee filter', () => {
    cy.route('GET', '**/trackedEntityInstances**').as('getTeisStatusAndAssigneeFilter');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the assignee filter button should show that unassigned filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to: None')
        .should('exist');
});

Then('teis with active enrollments and unassigned events should be retrieved from the api', () => {
    cy.wait('@getTeisStatusAndAssigneeFilter', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'programStatus=ACTIVE');

    cy.get('@result')
        .its('url')
        .should('include', 'assignedUserMode=NONE');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.trackedEntityInstances').as('teis');
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

When('you apply the current filter', () => {
    cy.route('GET', '**/trackedEntityInstances**').as('getTeis');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the first name filter button should show that the filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('First name: John')
        .should('exist');
});

Then('teis with a first name containing John should be retrieved from the api', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('match', /filter=.*John/);

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.trackedEntityInstances').as('teis');
});

Then('the list should display the teis retrieved from the api', () => {
    cy.get('@teis')
        .then((teis) => {
            cy.get('[data-test="tei-working-lists"]')
                .find('tr')
                .should('have.length', teis.length + 1);
        });

    cy.get('@teis')
        .then((teis) => {
            cy.get('[data-test="tei-working-lists"]')
                .find('tr')
                .each(($teiRow, index) => {
                    const rowId = $teiRow.get(0).getAttribute('id');
                    if (index > 1) {
                        expect(rowId).to.equal(teis[index - 1].trackedEntityInstance);
                    }
                });
        });
});

Then('the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

When('you click the next page buttton', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .should('exist');

    cy.route('GET', '**/trackedEntityInstances**').as('getTeis');

    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .click();
});

Then('new teis should be retrieved from the api', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result').its('response.body.trackedEntityInstances').as('teis');
});

Then('the list should show the second page', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

When('you click the previous page button', () => {
    cy.route('GET', '**/trackedEntityInstances**').as('getTeis');

    cy.get('[data-test="dhis2-capture-search-pagination-previous-page"]')
        .click();
});

When('you change rows per page to 50', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .should('exist');

    cy.route('GET', '**/trackedEntityInstances**').as('getTeis');

    cy.get('div[data-test="rows-per-page-selector"]')
        .click()
        .contains('50')
        .click();
});

Then('a tei batch capped at 50 records should be retrieved from the api', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'pageSize=50');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.trackedEntityInstances').as('teis');
});

When('you click the first page button', () => {
    cy.route('GET', '**/trackedEntityInstances**').as('getTeis');

    cy.get('[data-test="dhis2-capture-search-pagination-first-page"]')
        .click();
});

When('you click the first name column header', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('First name')
        .should('exist');

    cy.route('GET', '**/trackedEntityInstances**').as('getTeis');

    cy.get('[data-test="online-list-table"]')
        .contains('First name')
        .click();
});

Then('the sort arrow should indicate descending order', () => {
    cy.get('[data-test="data-table-desc-sort-icon"]')
        .should('exist');
});

Then('teis should be retrieved from the api ordered descendingly by first name', () => {
    cy.wait('@getTeis', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('match', /order=.*desc/);

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.trackedEntityInstances').as('teis');
});
