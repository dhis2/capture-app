import moment from 'moment';
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

When('the user sets the birthday date to the current date', () => {
    cy.get('[data-test="modal-edit-profile"]')
        .find('[data-test="capture-ui-input"]')
        .eq(8)
        .type(moment().format('YYYY-MM-DD'))
        .blur();
});
