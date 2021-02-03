Given('you are in the main page with no selections made', () => {
    cy.visit('/#/');
    cy.get('[data-test="dhis2-capture-new-event-button"]')
        .should('exist');
});

And('you see the dropdown menu for selecting tracked entity type', () => {
    cy.get('[data-test="dhis2-uicore-singleselect"]')
        .should('exist');
    cy.contains('You can also choose a program from the top bar')
        .should('exist');
});

And('you select org unit', () => {
    cy.get('[data-test="capture-ui-input"]')
        .type('Ngelehun C');
    cy.contains('Ngelehun CHC')
        .click();
});

Then('there should be visible a title with Child Program', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .contains('person in program: Child Programme')
        .should('exist');
});

And('there should be Child Programme domain forms visible to search with', () => {
    cy.get('[data-test="dhis2-capture-search-page-content"]')
        .find('[data-test="capture-ui-input"]')
        .should('have.length', 1);
});

Given('you open the the new event page in Ngelehun and malaria case context', () => {
    cy.visit('/#/new?programId=VBqh0ynB2wv&orgUnitId=DiszpKrYNg8');
});

When('you navigate to register a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-create-relationship-button"]')
        .click();
});

And('you navigate to find a person relationship', () => {
    cy.get('[data-test="dhis2-capture-add-relationship-button"]')
        .click();
    cy.get('[data-test="dhis2-capture-relationship-type-selector-button-mxZDvSZYxlw"]')
        .click();
    cy.get('[data-test="dhis2-capture-find-relationship-button"]')
        .click();
});

And('you select Child Programme', () => {
    cy.get('.Select')
        .type('Child Program');
    cy.contains('Child Programme')
        .click();
});

When('you have no program selection', () => {
    cy.get('[data-test="dhis2-capture-program-selector-container"]')
        .contains('Select program');
});

When('you click the next page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-next-page"]')
        .click();
});

Then('you can see the second page of the results', () => {
    cy.get('[data-test="dhis2-capture-search-results-list"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 2')
        .should('exist');
});

When('you click the previous page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-previous-page"]')
        .click();
});

Then('you can see the first page of the results', () => {
    cy.get('[data-test="dhis2-capture-search-results-list"]')
        .should('exist');
    cy.get('[data-test="dhis2-capture-card-list-item"]')
        .should('have.length.greaterThan', 0);
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

Then('all pagination is disabled', () => {
    cy.get('[data-test="dhis2-capture-pagination"]')
        .contains('Page 1')
        .should('exist');
});

And('you click search', () => {
    // click outside of the input for the values to be updated
    cy.get('[data-test="dhis2-capture-d2-form-component"]')
        .click();

    cy.get('button')
        .contains('Search by attributes')
        .click();
});

Then('for an event program the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

Then('for a tracker program the page navigation should show that you are on the first page', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Page 1')
        .should('exist');
});

Then('the assigned to filter button should show that the anyone filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to: Anyone')
        .should('exist');
});

When('you set the assignee filter to anyone', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Assigned to')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Anyone')
        .click();
});

When('you set the status filter to active', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Status')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .contains('Active')
        .click();
});

Then('the status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Status: Active')
        .should('exist');
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

Then('the pagination for the event working list should show the second page', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

Then('the pagination for the tei working list should show the second page', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Page 2')
        .should('exist');
});

Then('the sort arrow should indicate ascending order', () => {
    cy.get('[data-test="data-table-asc-sort-icon"]')
        .should('exist');
});

Then('the enrollment status filter button should show that the active filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Enrollment status: Active')
        .should('exist');
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
    cy.get('[data-test="list-view-filter-apply-button"]')
        .click();
});

Then('the first name filter button should show that the filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('First name: John')
        .should('exist');
});

When('you click the first page button', () => {
    cy.get('[data-test="dhis2-capture-search-pagination-first-page"]')
        .click();
});

Then('the sort arrow should indicate descending order', () => {
    cy.get('[data-test="data-table-desc-sort-icon"]')
        .should('exist');
});

Then('rows per page should be set to 15', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .contains('15')
        .should('exist');
});

Then('the assignee filter button should show that unassigned filter is in effect', () => {
    cy.get('[data-test="tei-working-lists"]')
        .contains('Assigned to: None')
        .should('exist');
});

When('you change rows per page to 10', () => {
    cy.get('div[data-test="rows-per-page-selector"]')
        .click()
        .contains('10')
        .click();
});
