// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes } from '../../rulesEngineActionsCreator/rulesEngine.actions';
import type { ProgramRuleEffect } from '../../RulesEngine/rulesEngine.types';

export const messageStateKeys = {
    ERROR: 'error',
    WARNING: 'warning',
    ERROR_ON_COMPLETE: 'errorOnComplete',
    WARNING_ON_COMPLETE: 'warningOnComplete',
};

const effectTypes = {
    HIDE_FIELD: 'HIDEFIELD',
    SHOW_ERROR: 'SHOWERROR',
    SHOW_WARNING: 'SHOWWARNING',
    SHOW_ERROR_ONCOMPLETE: 'ERRORONCOMPLETE',
    SHOW_WARNING_ONCOMPLETE: 'WARNINGONCOMPLETE',
};

export const rulesEffectsHiddenFieldsDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };
        
        const hideEffects: { [id: string]: Array<ProgramRuleEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectTypes.HIDE_FIELD];
        newState[action.payload.formId] = hideEffects ?
            Object.keys(hideEffects).reduce((accState, key) => {
                accState[key] = true;
                return accState;
            }, {}) :
            null;

        return newState;
    },
}, 'rulesEffectsHiddenFields');

const mapMessageEffectTypeToStateKey = {
    [effectTypes.SHOW_ERROR]: messageStateKeys.ERROR,
    [effectTypes.SHOW_WARNING]: messageStateKeys.WARNING,
    [effectTypes.SHOW_ERROR_ONCOMPLETE]: messageStateKeys.ERROR_ON_COMPLETE,
    [effectTypes.SHOW_WARNING_ONCOMPLETE]: messageStateKeys.WARNING_ON_COMPLETE,
};

export const rulesEffectsErrorMessagesDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const errorEffects: { [id: string]: Array<ProgramRuleEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectTypes.SHOW_ERROR];
        const warningEffects: { [id: string]: Array<ProgramRuleEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectTypes.SHOW_WARNING];
        const errorEffectsOnComplete: { [id: string]: Array<ProgramRuleEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectTypes.SHOW_ERROR_ONCOMPLETE];
        const warningEffectsOnComplete: { [id: string]: Array<ProgramRuleEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectTypes.SHOW_WARNING_ONCOMPLETE];

        const messageEffectsArray = [errorEffects, warningEffects, errorEffectsOnComplete, warningEffectsOnComplete];
        newState[action.payload.formId] = messageEffectsArray.reduce((accMessagesById, effects) => {
            if (!effects) {
                return accMessagesById;
            }

            return Object.keys(effects).reduce((accMessagesByIdInCurrentEffects, key) => {
                accMessagesByIdInCurrentEffects[key] = accMessagesByIdInCurrentEffects[key] || {};

                const effect = effects[key][0];
                const typeKey = mapMessageEffectTypeToStateKey[effect.action];
                accMessagesByIdInCurrentEffects[key][typeKey] = `${effect.content} ${effect.data || ''}`;
                return accMessagesByIdInCurrentEffects;
            }, accMessagesById);
        }, {});

        return newState;
    },
}, 'rulesEffectsMessages');
