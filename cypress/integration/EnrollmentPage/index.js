beforeEach(() => {
    cy.loginThroughForm();
});

Given('you are on an enrollment page', () => {
    cy.visit('/#/enrollment?programId=IpHINAT79UW&orgUnitId=UgYg0YW7ZIh&teiId=fhFQhO0xILJ&enrollmentId=gPDueU02tn8');
});

And('you reset the program selection', () => {
    cy.get('[data-test="reset-selection-button"]')
        .should('have.length.greaterThan', 2);
    cy.get('[data-test="reset-selection-button"]')
        .eq(0)
        .click();
});

And('you select the Inpatient morbidity program', () => {
    cy.get('.Select').eq(0)
        .type('Inpatient morbidi');
    cy.contains('Inpatient morbidity and mortality')
        .click();
});

And('you see the registration form for the Inpatient morbidity program', () => {
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New Inpatient morbidity and mortality')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Saving to Inpatient morbidity and mortality in Taninahun (Malen) CHP')
        .should('exist');
});

And('you see the registration form for the Malaria case diagnosis', () => {
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New malaria entity in program: Malaria case diagnosis, treatment and investigation')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Saving a malaria entity in Malaria case diagnosis, treatment and investigation in Taninahun (Malen) CHP.')
        .should('exist');
});

And('you see the registration form for the MNCH PNC program', () => {
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('New person in program: MNCH / PNC (Adult Woman)')
        .should('exist');
    cy.get('[data-test="dhis2-capture-registration-page-content"]')
        .contains('Saving a person in MNCH / PNC (Adult Woman) in Taninahun (Malen) CHP.')
        .should('exist');
});

And('you see the working lists for the Inpatient morbidity program', () => {
    cy.get('[data-test="event-working-lists"]')
        .find('tbody')
        .find('tr')
        .should('have.length', 15);
});

And('you select the Malaria case diagnosis program', () => {
    cy.get('.Select').eq(0)
        .type('Malaria case diag');
    cy.contains('Malaria case diagnosis')
        .click();
});

And('you select the MNCH PNC program', () => {
    cy.get('.Select').eq(0)
        .type('MNCH');
    cy.contains('PNC (Adult Woman)')
        .click();
});

And('you choose to register a new event program by clicking the link button', () => {
    cy.contains('Create a new event in this program.')
        .click();
});

And('you choose to be navigated to the working list by clicking the link button', () => {
    cy.contains('View working list in this program.')
        .click();
});

And('you choose to enroll a malaria entity by clicking the link button', () => {
    cy.contains('Enroll a new malaria entity in this program.')
        .click();
});

And('you choose to enroll a person by clicking the link button', () => {
    cy.contains('Enroll Carlos Cruz in this program.')
        .click();
});
