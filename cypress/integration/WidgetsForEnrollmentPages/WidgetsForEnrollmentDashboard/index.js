import '../sharedSteps';
import '../WidgetEnrollment';
import '../WidgetProfile';
import '../WidgetEnrollmentComment';

beforeEach(() => {
    cy.loginThroughForm();
});

Then('the user can see the program rules effect in the indicator widget', () => {
    cy.get('[data-test="indicator-widget"]').contains('Measles + Yellow fever doses');
});
