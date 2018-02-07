// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as fieldActionTypes } from '../../components/D2Form/D2SectionFields.actions';
import { actionTypes as loaderActionTypes } from '../../components/D2Form/actions/form.actions';
import { actionTypes as formBuilderActionTypes } from '../../components/D2Form/formBuilder.actions';

export const formsValuesDesc = createReducerDescription({
    [loaderActionTypes.ADD_FORM_DATA]: (state, action) => {
        const newState = { ...state };
        newState[action.meta.formId] = action.payload;
        return newState;
    },
    [fieldActionTypes.UPDATE_FIELD]: (state, action) => {
        const newState = { ...state };
        const meta = action.meta;
        const formValues = newState[meta.containerId] = { ...newState[meta.containerId] };
        formValues[meta.elementId] = action.payload;
        return newState;
    },
}, 'formsValues');

export const formsSectionsFieldsUIDesc = createReducerDescription({
    [formBuilderActionTypes.CACHE_FORMBUILDER_STATE]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.id] = payload.formState;
        return newState;
    },
}, 'formsSectionsFieldsUI');
