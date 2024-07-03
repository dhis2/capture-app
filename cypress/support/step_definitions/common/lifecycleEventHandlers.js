import { Before } from '@badeball/cypress-cucumber-preprocessor';
import { filterInstanceVersion, login } from '../../tagUtils';

Before(function callback() {
    filterInstanceVersion(() => this.skip());
    login();
});
