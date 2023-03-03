// @flow
import { v4 as uuid } from 'uuid';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { newPageActionTypes } from '../../components/Pages/New/NewPage.actions';
import { newPageStatuses } from '../../components/Pages/New/NewPage.constants';

type NewPageState = {
    newPageStatus: $Keys<typeof newPageStatuses>
}
const initialNewPageState: NewPageState = {
    newPageStatus: newPageStatuses.DEFAULT,
};

export const newPageDesc = createReducerDescription(
    {
        [newPageActionTypes.NEW_PAGE_DEFAULT_VIEW]: state => ({
            ...state,
            newPageStatus: newPageStatuses.DEFAULT,
        }),
        [newPageActionTypes.NEW_PAGE_WITHOUT_ORG_UNIT_SELECTED_VIEW]: state => ({
            ...state,
            newPageStatus: newPageStatuses.WITHOUT_ORG_UNIT_SELECTED,
        }),
        [newPageActionTypes.NEW_PAGE_WITHOUT_PROGRAM_CATEGORY_SELECTED_VIEW]: state => ({
            ...state,
            newPageStatus: newPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED,
        }),
        [newPageActionTypes.ASSIGN_UID]: (state, action) => {
            const { formId } = action.payload;
            const uid = uuid();
            return {
                ...state,
                [formId]: { uid },
            };
        },
        [newPageActionTypes.REMOVE_UID]: (state, action) => {
            const { formId, location } = action.payload;
            const newState = { ...state };
            if (location) {
                newState[formId] = { location };
            } else {
                delete newState[formId];
            }
            return {
                ...newState,
            };
        },
    },
    'newPage',
    initialNewPageState,
);
