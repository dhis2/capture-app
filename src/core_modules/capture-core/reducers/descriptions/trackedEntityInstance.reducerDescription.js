// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { dataEntryActionTypes, TEI_MODAL_STATE } from '../../components/WidgetProfile/DataEntry';

export const trackedEntityInstanceDesc = createReducerDescription(
    {
        [dataEntryActionTypes.SET_TEI_MODAL_STATE]: (state, action) => {
            const { modalState } = action.payload;
            return { ...state, modalState };
        },
        [dataEntryActionTypes.SET_TEI_ATTRIBUTE_VALUES]: (state, action) => {
            const { attributeValues } = action.payload;
            return { ...state, attributeValues };
        },
    },
    'trackedEntityInstance',
    {
        modalState: TEI_MODAL_STATE.CLOSE,
        attributeValues: [],
    },
);
