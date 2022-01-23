import React from 'react';
import { mount } from '@cypress/react';
import { WidgetError } from '../WidgetError';

describe('Error widget displays data', () => {
    it('Displays string data', () => {
        mount(<WidgetError error={['This is a test']} />);
        cy.get('[data-test="error-widget"]').contains('This is a test');
    });
});
