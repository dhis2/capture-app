// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { dataEntryActionTypes, TEI_MODAL_STATE } from '../../components/WidgetProfile/DataEntry';

export const trackedEntityInstanceDesc = createReducerDescription(
    {
        [dataEntryActionTypes.SET_TEI_MODAL_STATE]: (state, action) => {
            const { modalState } = action.payload;
            return { ...state, modalState };
        },
    },
    'trackedEntityInstance',
    {
        modalState: TEI_MODAL_STATE.CLOSE,
    },
);
