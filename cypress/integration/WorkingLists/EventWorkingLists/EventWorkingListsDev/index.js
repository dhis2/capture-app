import '../../sharedSteps';

Given('you open the main page with Ngelehun and malaria case context', () => {
    cy.server();
    cy.route('GET', '**/tracker/events**').as('getDefaultEvents');

    cy.visit('#/?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

Then('events should be retrieved from the api using the default query args', () => {
    cy.wait('@getDefaultEvents', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'pageSize=15');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.instances').as('events');
});

Then('the list should display the events retrieved from the api', () => {
    cy.get('@events')
        .then((events) => {
            cy.get('[data-test="event-working-lists"]')
                .find('tr')
                .should('have.length', events.length + 1);
        });

    cy.get('@events')
        .then((teis) => {
            cy.get('[data-test="event-working-lists"]')
                .find('tr')
                .each(($teiRow, index) => {
                    const rowId = $teiRow.get(0).getAttribute('data-test');
                    if (index > 1) {
                        expect(rowId).to.equal(teis[index - 1].event);
                    }
                });
        });
});

When('you select the working list called events assigned to anyone', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events assigned to anyone')
        .should('exist');

    cy.route('GET', '**/tracker/events**').as('getEventsAssignedToAnyone');

    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('Events assigned to anyone')
        .click();
});

Then('events assigned to anyone should be retrieved from the api', () => {
    cy.wait('@getEventsAssignedToAnyone', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'assignedUserMode=ANY');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.instances').as('events');
});

When('you apply the assignee filter', () => {
    cy.route('GET', '**/tracker/events**').as('getEventsAssignedToAnyone');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

When('you apply the status filter', () => {
    cy.route('GET', '**/tracker/events**').as('getActiveEventsAssignedToAnyone');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('active events that are assigned to anyone should be retrieved from the api', () => {
    cy.wait('@getActiveEventsAssignedToAnyone', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'assignedUserMode=ANY');

    cy.get('@result')
        .its('url')
        .should('include', 'status=ACTIVE');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.instances').as('events');
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

When('you apply the current filter on the event working list', () => {
    cy.route('GET', '**/tracker/events**').as('getEvents');

    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the age filter button should show that the filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Age (years): 10 to 20')
        .should('exist');
});

Then('events where age is between 10 and 20 should be retrieved from the api', () => {
    cy.wait('@getEvents', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('match', /filter=.*10/);

    cy.get('@result')
        .its('url')
        .should('match', /filter=.*20/);

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.instances').as('events');
});

When('you click the next page button on the event working list', () => {
    cy.get('[data-test="search-pagination-next-page"]')
        .should('exist');

    cy.route('GET', '**/tracker/events**').as('getEvents');

    cy.get('[data-test="search-pagination-next-page"]')
        .click();
});

Then('new events should be retrieved from the api', () => {
    cy.wait('@getEvents', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result').its('response.body.instances').as('events');
});

When('you click the previous page button on the event working list', () => {
    cy.route('GET', '**/tracker/events**').as('getEvents');

    cy.get('[data-test="search-pagination-previous-page"]')
        .click();
});

When('you click the first page button on the event working list', () => {
    cy.route('GET', '**/tracker/events**').as('getEvents');

    cy.get('[data-test="search-pagination-first-page"]')
        .click();
});

When('you change rows per page to 50', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .should('exist');

    cy.route('GET', '**/tracker/events**').as('getEvents');

    cy.get('div[data-test="rows-per-page-selector"]')
        .click()
        .contains('50')
        .click();
});

Then('an event batch capped at 50 records should be retrieved from the api', () => {
    cy.wait('@getEvents', { timeout: 40000 }).as('result');

    cy.get('@result')
        .its('status')
        .should('equal', 200);

    cy.get('@result')
        .its('url')
        .should('include', 'pageSize=50');

    cy.get('@result')
        .its('url')
        .should('include', 'page=1');

    cy.get('@result').its('response.body.instances').as('events');
});

When('you click the report date column header', () => {
    cy.get('[data-test="online-list-table"]')
        .contains('Report date')
        .should('exist');

    cy.route('GET', '**/tracker/events**').as('getEvents');

    cy.get('[data-test="dhis2-uicore-tableheadercellaction"]')
        .eq(0)
        .click()
        .click();
});

Then('events should be retrieved from the api ordered ascendingly by report date', () => {
    cy.wait('@getEvents', { timeout: 40000 }).as('resultDefault');
    cy.wait('@getEvents', { timeout: 40000 }).as('resultAsc');

    cy.get('@resultAsc')
        .its('status')
        .should('equal', 200);

    cy.get('@resultAsc')
        .its('url')
        .should('match', /order=.*asc/);

    cy.get('@resultAsc')
        .its('url')
        .should('include', 'page=1');

    cy.get('@resultAsc').its('response.body.instances').as('events');
});
