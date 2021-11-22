Given('you open the main page with Ngelehun and Inpatient morbidity and mortality context', () => {
    cy.visit('#/?programId=eBAyeGv0exc&orgUnitId=DiszpKrYNg8');
});

When('you set the date of admission filter', () => {
    cy.get('[data-test="event-working-lists"]')
        .within(() => {
            cy.contains('More filters')
                .click();

            cy.contains('Date of admission')
                .click();
        });

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .type('2018-01-01');

                    cy.wrap($elements[1])
                        .type('2018-12-31');
                });

            cy.contains('Apply')
                .click();
        });
});

When('you save the view as dateFilterWorkingList', () => {
    cy.get('[data-test="list-view-menu-button"]')
        .click();

    cy.contains('Save current view')
        .click();

    cy.get('[data-test="view-name-content"]')
        .type('dateFilterWorkingList');

    cy.server();
    cy.route('POST', '**/eventFilters**').as('newEventFilter');

    cy.get('button')
        .contains('Save')
        .click();

    cy.wait('@newEventFilter', { timeout: 30000 }).as('newEventResult');
});

When('you refresh the page', () => {
    cy.reload();
});

When('you open the dateFilterWorkingList', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .contains('dateFilterWorkingList')
        .click();
});

Then('the admission filter should be in effect', () => {
    cy.get('[data-test="event-working-lists"]')
        .contains('Date of admission: 2018-01...')
        .click();

    cy.get('[data-test="list-view-filter-contents"]')
        .within(() => {
            cy.get('input[type="text"]')
                .then(($elements) => {
                    cy.wrap($elements[0])
                        .should('have.attr', 'value', '2018-01-01');

                    cy.wrap($elements[1])
                        .should('have.attr', 'value', '2018-12-31');
                });
        });

    // clean up
    cy.get('@newEventResult')
        .then((result) => {
            expect(result.status).to.equal(201);
            const id = result.response.body.response.uid;
            cy.buildApiUrl('eventFilters', id)
                .then((eventFiltersUrl) => {
                    cy.request('DELETE', eventFiltersUrl);
                });
        });
});
