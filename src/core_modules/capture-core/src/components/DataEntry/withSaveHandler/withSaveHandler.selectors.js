// @flow
import { createSelector } from 'reselect';
import { messageStateKeys } from '../../../reducers/descriptions/rulesEffects.reducerDescription';

const foundationSelector = (state, props, calculatedValues) => calculatedValues.foundation;

const boundMessagesSelector = (state, props, calculatedValues) => state.rulesEffectsMessages[calculatedValues.key];
const generalMessagesSelector = (state, props, calculatedValues) => state.rulesEffectsMessages[calculatedValues.key]

// $FlowFixMe
export const makeGetWarnings = () => createSelector(
    boundMessagesSelector,
    foundationSelector,
    (boundMessages, foundation) => {
        boundMessages = boundMessages || [];
        // generalMessages = generalMessages || [];

        const boundWarnings = Object
            .keys(boundMessages)
            .map((elementId) => {
                const messages = boundMessages[elementId];
                const warningOnComplete = messages[messageStateKeys.WARNING_ON_COMPLETE];
                if (!warningOnComplete) {
                    return null;
                }

                const element = foundation.getElement(elementId);
                if (!element) {
                    return null;
                }

                return {
                    name: element.name,
                    warning: warningOnComplete,
                };
            })
            .filter(warning => warning);

        return boundWarnings;
    },
);

// $FlowFixMe
export const makeGetErrors = () => createSelector(
    boundMessagesSelector,
    foundationSelector,
    (boundMessages, foundation) => {
        boundMessages = boundMessages || [];
        // generalMessages = generalMessages || [];

        const boundErrors = Object
            .keys(boundMessages)
            .map((elementId) => {
                const messages = boundMessages[elementId];
                const errorOnComplete = messages[messageStateKeys.ERROR_ON_COMPLETE];
                if (!errorOnComplete) {
                    return null;
                }

                const element = foundation.getElement(elementId);
                if (!element) {
                    return null;
                }

                return {
                    name: element.name,
                    error: errorOnComplete,
                };
            })
            .filter(error => error);

        return boundErrors;
    },
);
