// @flow
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
        [newPageActionTypes.NEW_PAGE_WITHOUT_PROGRAM_PARTNER_SELECTED_VIEW]: state => ({
            ...state,
            newPageStatus: newPageStatuses.WITHOUT_PROGRAM_PARTNER_SELECTED,
        }),
    },
    'newPage',
    initialNewPageState,
);
