// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { dataEntryActionTypes } from '../../components/WidgetProfile/DataEntry';

export const trackedEntityInstanceDesc = createReducerDescription(
    {
        [dataEntryActionTypes.SET_TEI_MODAL_ERROR]: (state, action) => {
            const { hasError } = action.payload;
            return { ...state, hasError };
        },
        [dataEntryActionTypes.SET_TEI_ATTRIBUTE_VALUES]: (state, action) => {
            const { attributeValues } = action.payload;
            return { ...state, attributeValues };
        },
    },
    'trackedEntityInstance',
    {
        attributeValues: [],
    },
);
