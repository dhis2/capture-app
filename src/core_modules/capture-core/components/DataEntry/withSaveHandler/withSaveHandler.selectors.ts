import { createSelector } from 'reselect';
import { messageStateKeys } from '../../../reducers/descriptions/rulesEffects.reducerDescription';

const foundationSelector = (state: any, props: any, calculatedValues: any) => calculatedValues.foundation;

const boundMessagesSelector = (state: any, props: any, calculatedValues: any) => 
    state.rulesEffectsMessages[calculatedValues.key];
const generalWarningsOnCompleteSelector = (state: any, props: any, calculatedValues: any) =>
    (state.rulesEffectsGeneralWarnings[calculatedValues.key] ?
        state.rulesEffectsGeneralWarnings[calculatedValues.key].warningOnComplete :
        undefined
    );
const generalErrorsOnCompleteSelector = (state: any, props: any, calculatedValues: any) =>
    (state.rulesEffectsGeneralErrors[calculatedValues.key] ?
        state.rulesEffectsGeneralErrors[calculatedValues.key].errorOnComplete :
        undefined
    );

export const makeGetWarnings = () => createSelector(
    boundMessagesSelector,
    generalWarningsOnCompleteSelector,
    foundationSelector,
    (boundMessages: any, generalWarningsOnComplete: any, foundation: any) => {
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
            .map((w: any) => ({
                key: w.id,
                name: null,
                warning: w.message,
            }));
        return [...boundWarnings, ...unboundWarnings];
    },
);

export const makeGetErrors = () => createSelector(
    boundMessagesSelector,
    generalErrorsOnCompleteSelector,
    foundationSelector,
    (boundMessages: any, generalErrorsOnComplete: any, foundation: any) => {
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
            .map((e: any) => ({
                key: e.id,
                name: null,
                error: e.message,
            }));

        return [...boundErrors, ...unboundErrors];
    },
);
