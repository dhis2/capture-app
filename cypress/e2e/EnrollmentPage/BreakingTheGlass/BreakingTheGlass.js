import { Given, When, Then, After, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

const clearTestTei = () =>
    cy.buildApiUrl('tracker', 'trackedEntities?filter=w75KJ2mc4zz:like:Breaking&filter=zDhUuAYrxNC:like:TheGlass&trackedEntityType=nEenWmSyUEp&page=1&pageSize=5&orgUnitMode=ACCESSIBLE')
        .then(url => cy.request(url))
        .then(({ body }) => {
            const apiTrackedEntities = body.trackedEntities || body.instances || [];
            return apiTrackedEntities.forEach(({ trackedEntity }) =>
                cy
                    .buildApiUrl('tracker?async=false&importStrategy=DELETE')
                    .then(trackedEntityUrl => cy.request('POST', trackedEntityUrl, { trackedEntities: [{ trackedEntity }] })),
            );
        });

After({ tags: '@with-breaking-the-glass-tei-cleanup' }, () => {
    // The scenario ends logged in as the search-scope-only user, which cannot delete the tei.
    cy.loginByApi({
        username: Cypress.env('dhis2Username'),
        password: Cypress.env('dhis2Password'),
        baseUrl: Cypress.env('dhis2BaseUrl'),
    });
    clearTestTei();
});

Given('the tei created by this test is cleared from the database', () => {
    clearTestTei();
});

And('you create a new tei in Child programme from Ngelehun CHC', () => {
    cy.visit('/#/new?orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW');
    cy.get('input[type="text"]')
        .eq(1)
        .type('1999-09-01')
        .blur();
    cy.get('[data-test="d2-section"]')
        .find('input[type="text"]')
        .eq(0)
        .type('Breaking')
        .blur();
    cy.get('[data-test="d2-section"]')
        .find('input[type="text"]')
        .eq(1)
        .type('TheGlass')
        .blur();
    cy.get('input[type="text"]')
        .eq(7)
        .type('2023-09-01')
        .blur();

    clickSave();
});

const clickSave = () => {
    cy.get('[data-test="create-and-link-button"]')
        .contains('Save person')
        .click();
    // Wait for enrollment dashboard
    cy.get('[data-test="profile-widget"]')
        .contains('Person profile')
        .should('exist');
};

And('you change program to WHO RMNCH Tracker', () => {
    cy.get('[data-test="program-selector-container"]')
        .click();
    cy.get('[data-test="program-filterinput"]')
        .type('WHO RMNCH Tra');
    cy.contains('WHO RMNCH Tracker')
        .click();
});

And('you enroll the tei from Njandama MCHP', () => {
    cy.get('[data-test="org-unit-selector-container"]')
        .click();
    cy.contains('Njandama MCHP')
        .click();

    cy.get('[data-test="enrollment-page-content"]')
        .contains('Enroll Breaking TheGlass in this program')
        .click();

    cy.get('[data-test="d2-section"]')
        .find('input[type="text"]')
        .eq(8)
        .type('1999-09-01')
        .blur();

    clickSave();
});

And('you log out', () => {
    cy.clearCookies();
});

And('you log in as tracker2 user', () => {
    const baseUrl = Cypress.env('dhis2BaseUrl');
    const username = 'tracker2';

    cy.session(`user${username}`, () => {
        cy.loginByApi({ username, password: 'Tracker@123', baseUrl });
    }, {
        cacheAcrossSpecs: true,
        validate: () => {
            cy.validateUserIsLoggedIn({ baseUrl, username });
        },
    });

    cy.visit('/');
    cy.get('[data-test="scope-selector"]', { timeout: 60000 })
        .should('exist');
});

And('you select the new tei', () => {
    cy.visit('/#/?orgUnitId=DiszpKrYNg8&programId=IpHINAT79UW');
    cy.contains('Breaking')
        .click();
    // Wait for enrollment dashboard
    cy.get('[data-test="profile-widget"]')
        .contains('Person profile')
        .should('exist');
});

Then('you see the breaking the glass page', () => {
    cy.get('[data-test=breaking-the-glass-widget]')
        .should('exist');
});

When('you type a reason', () => {
    cy.get('[data-test=breaking-the-glass-widget]')
        .find('textarea')
        .type('Hello')
        .blur();
});

And('you click Check for enrollments', () => {
    cy.get('[data-test=breaking-the-glass-widget]')
        .find('[data-test=dhis2-uicore-button]')
        .eq(0)
        .click();
});

Then('you see the enrollment in WHO RMNCH Tracker', () => {
    cy.get('[data-test=stages-and-events-widget]')
        .contains('Previous deliveries')
        .should('exist');
});
