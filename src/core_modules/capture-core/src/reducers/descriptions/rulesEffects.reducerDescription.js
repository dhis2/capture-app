// @flow
import { effectActions } from 'capture-core-utils/RulesEngine';
import type { OutputEffect } from 'capture-core-utils/RulesEngine/rulesEngine.types';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes } from '../../rulesEngineActionsCreator/rulesEngine.actions';

export const messageStateKeys = {
    ERROR: 'error',
    WARNING: 'warning',
    ERROR_ON_COMPLETE: 'errorOnComplete',
    WARNING_ON_COMPLETE: 'warningOnComplete',
};

export const rulesEffectsHiddenFieldsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
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
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
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
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
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
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
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
                const typeKey = mapMessageEffectTypeToStateKey[effect.type];
                accMessagesByIdInCurrentEffects[key][typeKey] = effect.message;
                return accMessagesByIdInCurrentEffects;
            }, accMessagesById);
        }, {});

        return newState;
    },
}, 'rulesEffectsMessages');

export const rulesEffectsFeedbackDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
        const newState = { ...state };

        const displayTextEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_TEXT];
        const displayKeyValuePairEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_KEY_VALUE_PAIR];
        newState[action.payload.formId] = {
            displayTexts: displayTextEffects && displayTextEffects.feedback ? displayTextEffects.feedback.map(e => e.message) : null,
            displayKeyValuePairs: displayKeyValuePairEffects && displayKeyValuePairEffects.feedback ? displayKeyValuePairEffects.feedback.map(e => ({ key: e.message, value: e.value })) : null,
        };

        return newState;
    },
}, 'rulesEffectsFeedback', {});

export const rulesEffectsIndicatorsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
        const newState = { ...state };

        const displayTextEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_TEXT];
        const displayKeyValuePairEffects: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.DISPLAY_KEY_VALUE_PAIR];
        newState[action.payload.formId] = {
            displayTexts: displayTextEffects && displayTextEffects.indicators ? displayTextEffects.indicators.map(e => e.message) : null,
            displayKeyValuePairs: displayKeyValuePairEffects && displayKeyValuePairEffects.indicators ? displayKeyValuePairEffects.indicators.map(e => ({ key: e.message, value: e.value })) : null,
        };

        return newState;
    },
}, 'rulesEffectsIndicators', {});


export const rulesEffectsGeneralErrorsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
        const newState = { ...state };

        const errors: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_ERROR];
        newState[action.payload.formId] = errors && errors.generalErrors ? errors.generalErrors.map(e => e.message) : null;

        return newState;
    },
}, 'rulesEffectsGeneralErrors', {});

export const rulesEffectsGeneralWarningsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS_EVENT]: (state, action) => {
        const newState = { ...state };

        const warnings: { [id: string]: Array<OutputEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectActions.SHOW_WARNING];
        newState[action.payload.formId] = warnings && warnings.generalWarnings ? warnings.generalWarnings.map(e => e.message) : null;

        return newState;
    },
}, 'rulesEffectsGeneralWarnings', {});
