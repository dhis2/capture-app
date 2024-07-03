import { Given, Then, defineStep as And, After, When, Before } from '@badeball/cypress-cucumber-preprocessor';

const cleanUpEvent = () => {
    cy.visit('/#/viewEvent?viewEventId=rgWr86qs0sI');

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Edit event')
        .click();

    cy.get('[data-test="dataEntrySection-categorycombo"]')
        .within(() => {
            cy.get('[data-test="virtualized-select"]')
                .eq(0)
                .click()
                .contains('CARE International')
                .click({ force: true });
        });

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
};

After({ tags: '@with-event-coc-clean-up' }, cleanUpEvent);

Before({ tags: '@with-event-coc-clean-up' }, cleanUpEvent);

Given('you open the main page with Ngelehun and antenatal care context', () => {
    cy.visit('#/?programId=lxAQ7Zs9VYR&orgUnitId=DiszpKrYNg8');
});

And('you open the first event in the list', () => {
    cy.get('[data-test="online-list-table"]').within(() => {
        cy.get('[data-test="dhis2-uicore-tablebody"]')
            .find('tr')
            .eq(0)
            .click();
    });
});

And('you (incomplete)(complete) and save the event', () => {
    cy.contains('Edit event')
        .click();

    cy.get('[data-test="dataentry-field-complete"]')
        .find('input')
        .click()
        .blur();

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
});

Then(/^you are redirected to the main page and the event status (.*) is displayed in the list/, (status) => {
    cy.url().should('include', 'programId=lxAQ7Zs9VYR');
    cy.url().should('include', 'orgUnitId=DiszpKrYNg8');
    cy.get('[data-test="online-list-table"]').within(() => {
        cy.get('[data-test="dhis2-uicore-tablebody"]')
            .find('tr')
            .eq(0)
            .contains(status);
    });
});


Given(/^you land on the view event page with event id: (.*)$/, (eventId) => {
    cy.visit(`/#/viewEvent?viewEventId=${eventId}`);
});

Then('the event details page displays the category combination', () => {
    cy.get('[data-test="dataEntrySection-categorycombo"]')
        .contains('CARE International');
});

And('you enable edit mode', () => {
    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Edit event')
        .click();
});

When('you change the category combination and save', () => {
    cy.get('[data-test="dataentry-field-attributeCategoryOptions-LFsZ8v5v7rq"]')
        .within(() => {
            cy.get('[data-test="virtualized-select"]')
                .eq(0)
                .click()
                .contains('APHIAplus')
                .click({ force: true });
        });

    cy.get('[data-test="dhis2-uicore-button"]')
        .contains('Save')
        .click();
});

Then('the event details page displays the updated category combination', () => {
    cy.get('[data-test="dataEntrySection-categorycombo"]')
        .contains('APHIAplus');
});

Given('you open an event in Ngelehun and malaria case context', () => {
    cy.visit('#/viewEvent?viewEventId=a93201a6a99');
});

When('you search for an existing unique id and link to the person', () => {
    cy.intercept('POST', '**/tracker?async=false', (req) => {
        if (req.body.relationships) {
            req.alias = 'postRelationshipData';
        }
    });

    cy.get('[data-test="form-field-lZGmxYbs97q"]')
        .find('input')
        .type('9191132445122')
        .blur();

    cy.get('[data-test="relationship-tei-search-button-relationshipTeiSearch-nEenWmSyUEp-0"]')
        .click();

    cy.get('[data-test="relationship-tei-link-vu9dsAuJ29q"]')
        .click();

    cy.wait('@postRelationshipData', { timeout: 20000 });
});

When('you click the delete relationship button', () => {
    cy.intercept('POST', '**/tracker?importStrategy=DELETE&async=false', (req) => {
        if (req.body.relationships) {
            req.alias = 'deleteRelationshipData';
        }
    });
    cy.get('[data-test="delete-relationship-button"]')
        .click();
});

Then('the relationship is deleted', () => {
    cy.wait('@deleteRelationshipData')
        .then((result) => {
            expect(result.response.statusCode).to.equal(200);
        });
});

And('you select the TB Program', () => {
    cy.get('[data-test="relationship-register-tei-program-selector"]')
        .find('input')
        .type('TB', { force: true });
    cy.contains('TB program').click();
});

Then('the TB program enroll form is loaded', () => {
    cy.contains('TB identifier').should('exist');
});
