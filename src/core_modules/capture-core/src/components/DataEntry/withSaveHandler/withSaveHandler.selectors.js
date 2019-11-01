// @flow
import { createSelector } from 'reselect';
import { messageStateKeys } from '../../../reducers/descriptions/rulesEffects.reducerDescription';

const foundationSelector = (state, props, calculatedValues) => calculatedValues.foundation;

const boundMessagesSelector = (state, props, calculatedValues) => state.rulesEffectsMessages[calculatedValues.key];
const generalWarningsOnCompleteSelector = (state, props, calculatedValues) =>
    (state.rulesEffectsGeneralWarnings[calculatedValues.key] ?
        state.rulesEffectsGeneralWarnings[calculatedValues.key].warningOnComplete :
        undefined
    );
const generalErrorsOnCompleteSelector = (state, props, calculatedValues) =>
    (state.rulesEffectsGeneralErrors[calculatedValues.key] ?
        state.rulesEffectsGeneralErrors[calculatedValues.key].errorOnComplete :
        undefined
    );

// $FlowFixMe
export const makeGetWarnings = () => createSelector(
    boundMessagesSelector,
    generalWarningsOnCompleteSelector,
    foundationSelector,
    (boundMessages, generalWarningsOnComplete, foundation) => {
        boundMessages = boundMessages || {};
        generalWarningsOnComplete = generalWarningsOnComplete || [];

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
                    key: elementId,
                    name: element.name,
                    warning: warningOnComplete,
                };
            })
            .filter(warning => warning);

        const unboundWarnings = generalWarningsOnComplete
            .map((w => ({
                key: w.id,
                name: null,
                warning: w.message,
            })));
        return [...boundWarnings, ...unboundWarnings];
    },
);

// $FlowFixMe
export const makeGetErrors = () => createSelector(
    boundMessagesSelector,
    generalErrorsOnCompleteSelector,
    foundationSelector,
    (boundMessages, generalErrorsOnComplete, foundation) => {
        boundMessages = boundMessages || {};
        generalErrorsOnComplete = generalErrorsOnComplete || [];

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
                    key: elementId,
                    name: element.name,
                    error: errorOnComplete,
                };
            })
            .filter(error => error);

        const unboundErrors = generalErrorsOnComplete
            .map((e => ({
                key: e.id,
                name: null,
                error: e.message,
            })));

        return [...boundErrors, ...unboundErrors];
    },
);
