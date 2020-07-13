// @flow
import { effectActions } from '../../rules/engine';
import type {
    OutputEffect,
    GeneralErrorEffect,
    GeneralWarningEffect,
} from '../../rules/engine';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes } from '../../rules/actionsCreator';

export const messageStateKeys = {
    ERROR: 'error',
    WARNING: 'warning',
    ERROR_ON_COMPLETE: 'errorOnComplete',
    WARNING_ON_COMPLETE: 'warningOnComplete',
};

export const rulesEffectsHiddenFieldsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const hideEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.HIDE_FIELD];
        newState[action.payload.formId] = hideEffects ?
            Object.keys(hideEffects).reduce((accState, key) => {
                accState[key] = true;
                return accState;
            }, {}) :
            null;

        return newState;
    },
}, 'rulesEffectsHiddenFields');

export const rulesEffectsCompulsoryFieldsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const compulsoryEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.MAKE_COMPULSORY];
        newState[action.payload.formId] = compulsoryEffects ?
            Object.keys(compulsoryEffects).reduce((accState, key) => {
                accState[key] = true;
                return accState;
            }, {}) :
            null;

        return newState;
    },
}, 'rulesEffectsCompulsoryFields');

export const rulesEffectsHiddenSectionsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const hideEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.HIDE_SECTION];
        newState[action.payload.formId] = hideEffects ?
            Object.keys(hideEffects).reduce((accState, key) => {
                accState[key] = true;
                return accState;
            }, {}) :
            null;

        return newState;
    },
}, 'rulesEffectsHiddenSections');

const mapMessageEffectTypeToStateKey = {
    [effectActions.SHOW_ERROR]: messageStateKeys.ERROR,
    [effectActions.SHOW_WARNING]: messageStateKeys.WARNING,
    [effectActions.SHOW_ERROR_ONCOMPLETE]: messageStateKeys.ERROR_ON_COMPLETE,
    [effectActions.SHOW_WARNING_ONCOMPLETE]: messageStateKeys.WARNING_ON_COMPLETE,
};

export const rulesEffectsErrorMessagesDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const errorEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_ERROR];
        const warningEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_WARNING];
        const errorEffectsOnComplete: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_ERROR_ONCOMPLETE];
        const warningEffectsOnComplete: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_WARNING_ONCOMPLETE];

        const messageEffectsArray = [errorEffects, warningEffects, errorEffectsOnComplete, warningEffectsOnComplete];
        newState[action.payload.formId] = messageEffectsArray.reduce((accMessagesById, effects) => {
            if (!effects) {
                return accMessagesById;
            }

            return Object.keys(effects).reduce((accMessagesByIdInCurrentEffects, key) => {
                accMessagesByIdInCurrentEffects[key] = accMessagesByIdInCurrentEffects[key] || {};

                const effect = effects[key][0];
                // $FlowFixMe[prop-missing] automated comment
                const typeKey = mapMessageEffectTypeToStateKey[effect.type];
                // $FlowFixMe[prop-missing] automated comment
                accMessagesByIdInCurrentEffects[key][typeKey] = effect.message;
                return accMessagesByIdInCurrentEffects;
            }, accMessagesById);
        }, {});

        return newState;
    },
}, 'rulesEffectsMessages');

export const rulesEffectsFeedbackDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const displayTextEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_TEXT];
        const displayKeyValuePairEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_KEY_VALUE_PAIR];
        newState[action.payload.formId] = {
            // $FlowFixMe[prop-missing] automated comment
            displayTexts: displayTextEffects && displayTextEffects.feedback ? displayTextEffects.feedback.map(e => e.displayText) : null,
            // $FlowFixMe[prop-missing] automated comment
            displayKeyValuePairs: displayKeyValuePairEffects && displayKeyValuePairEffects.feedback ? displayKeyValuePairEffects.feedback.map(e => e.displayKeyValuePair) : null,
        };

        return newState;
    },
}, 'rulesEffectsFeedback', {});

export const rulesEffectsIndicatorsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const displayTextEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_TEXT];
        const displayKeyValuePairEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_KEY_VALUE_PAIR];
        newState[action.payload.formId] = {
            // $FlowFixMe[prop-missing] automated comment
            displayTexts: displayTextEffects && displayTextEffects.indicators ? displayTextEffects.indicators.map(e => e.displayText) : null,
            // $FlowFixMe[prop-missing] automated comment
            displayKeyValuePairs: displayKeyValuePairEffects && displayKeyValuePairEffects.indicators ? displayKeyValuePairEffects.indicators.map(e => e.displayKeyValuePair) : null,
        };

        return newState;
    },
}, 'rulesEffectsIndicators', {});


export const rulesEffectsGeneralErrorsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const errorEffects: { [id: string]: Array<GeneralErrorEffect> } =
            action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_ERROR];
        const errorEffectsOnComplete: { [id: string]: Array<GeneralErrorEffect> } =
            action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_ERROR_ONCOMPLETE];

        const generalErrors = errorEffects && errorEffects.general ? errorEffects.general.map(e => e.error) : null;
        const generalErrorsOnComplete = errorEffectsOnComplete && errorEffectsOnComplete.general ?
            errorEffectsOnComplete.general.map(e => e.error) :
            null;

        newState[action.payload.formId] = {
            [mapMessageEffectTypeToStateKey[effectActions.SHOW_ERROR]]: generalErrors,
            [mapMessageEffectTypeToStateKey[effectActions.SHOW_ERROR_ONCOMPLETE]]: generalErrorsOnComplete,
        };

        return newState;
    },
}, 'rulesEffectsGeneralErrors', {});

export const rulesEffectsGeneralWarningsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const warningsEffects: { [id: string]: Array<GeneralWarningEffect> } =
            action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_WARNING];
        const warningsEffectsOnComplete: { [id: string]: Array<GeneralWarningEffect> } =
            action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_WARNING_ONCOMPLETE];

        const generalWarnings = warningsEffects && warningsEffects.general ?
            warningsEffects.general.map(w => w.warning) : null;
        const generalWarningsOnComplete = warningsEffectsOnComplete && warningsEffectsOnComplete.general ?
            warningsEffectsOnComplete.general.map(w => w.warning) : null;

        newState[action.payload.formId] = {
            [mapMessageEffectTypeToStateKey[effectActions.SHOW_WARNING]]: generalWarnings,
            [mapMessageEffectTypeToStateKey[effectActions.SHOW_WARNING_ONCOMPLETE]]: generalWarningsOnComplete,
        };

        return newState;
    },
}, 'rulesEffectsGeneralWarnings', {});

export const rulesEffectsDisabledFieldsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };
        const assignEffects: { [id: string]: Array<OutputEffect> } =
            action.payload.rulesEffects && action.payload.rulesEffects[effectActions.ASSIGN_VALUE];
        newState[action.payload.formId] = assignEffects ?
            Object.keys(assignEffects).reduce((accState, key) => {
                accState[key] = true;
                return accState;
            }, {}) :
            null;
        return newState;
    },
}, 'rulesEffectsDisabledFields');


export const ruleEffectsOptionsVisibilityDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };
        const rulesEffects = action.payload.rulesEffects;
        if (action.payload.rulesEffects) {
            newState[action.payload.formId] = {
                hideOptions: rulesEffects[effectActions.HIDE_OPTION],
                hideOptionGroups: rulesEffects[effectActions.HIDE_OPTION_GROUP],
                showOptionGroups: rulesEffects[effectActions.SHOW_OPTION_GROUP],
            };
        }
        return newState;
    },
}, 'rulesEffectsOptionsVisibility');
