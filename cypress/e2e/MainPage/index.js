import { Given, Then, defineStep as And } from '@badeball/cypress-cucumber-preprocessor';
import '../sharedSteps';

Given('you are in the search page with Ngelehun and MNCH PNC context', () => {
    cy.visit('/#/search?orgUnitId=DiszpKrYNg8&programId=uy2gU8kT1jF');
});

Given('you are in the search page with Ngelehun and malaria focus investigation program context', () => {
    cy.visit('/#/search?programId=M3xtLkYBlKI&orgUnitId=DiszpKrYNg8');
});

Given('you open the main page with Ngelehun and child programme context', () => {
    cy.visit('#/?programId=IpHINAT79UW&orgUnitId=DiszpKrYNg8');
});

And('you can load the view with the name Events assigned to me', () => {
    cy.get('[data-test="workinglists-template-selector-chips-container"]')
        .within(() => {
            cy.contains('Events assigned to me').click();
        });
});

Then('the icon is rendered as a custom icon', () => {
    cy.get('[alt="child_program_positive"]')
        .invoke('attr', 'src')
        .should('match', /\/icons\/child_program_positive\/icon$/);
});

Then('the icon is rendered as an svg', () => {
    cy.get('[alt="child_program_positive"]')
        .invoke('attr', 'src')
        .should('match', /\/icons\/child_program_positive\/icon.svg$/);
});

Then('the TEI working list is displayed', () => {
    cy.get('[data-test="tei-working-lists"]').within(() => {
        cy.contains('Rows per page').should('exist');
        cy.contains('First name').should('exist');
        cy.contains('Last name').should('exist');
    });
});

Then('the event working list is displayed', () => {
    cy.get('[data-test="event-working-lists"]').within(() => {
        cy.contains('Visit date').should('exist');
        cy.contains('Status').should('exist');
    });
});

Then('the search form is displayed', () => {
    cy.get('[data-test="search-page-content"]').within(() => {
        cy.contains('Search for person in program: MNCH / PNC (Adult Woman)').should('exist');
        cy.contains('Search by attributes').should('exist');
    });
});
