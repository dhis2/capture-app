// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes } from '../../middleware/rulesEngine/rulesEngine.actions';
import type { ProgramRuleEffect } from '../../RulesEngine/rulesEngine.types';

const effectTypes = {
    HIDE_FIELD: 'HIDEFIELD',
    SHOW_ERROR: 'SHOWERROR',
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

export const rulesEffectsErrorMessagesDesc = createReducerDescription({
    [actionTypes.UPDATE_RULES_EFFECTS]: (state, action) => {
        const newState = { ...state };

        const errorEffects: { [id: string]: Array<ProgramRuleEffect> } = action.payload.rulesEffects && action.payload.rulesEffects[effectTypes.SHOW_ERROR];
        newState[action.payload.formId] = errorEffects ?
            Object.keys(errorEffects).reduce((accState, key) => {
                accState[key] = errorEffects[key][0].content;
                return accState;
            }, {}) :
            null;

        return newState;
    },
}, 'rulesEffectsErrorMessages');
