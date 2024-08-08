// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { newPageActionTypes } from '../../components/Pages/New/NewPage.actions';
import { newPageStatuses } from '../../components/Pages/New/NewPage.constants';
import { registrationFormActionTypes } from '../../components/Pages/New/RegistrationDataEntry/RegistrationDataEntry.actions';

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
        [newPageActionTypes.NEW_PAGE_CATEGORY_OPTION_INVALID_FOR_ORG_UNIT_VIEW]: state => ({
            ...state,
            newPageStatus: newPageStatuses.CATEGORY_OPTION_INVALID_FOR_ORG_UNIT,
        }),
        [registrationFormActionTypes.NEW_TRACKED_ENTITY_INSTANCE_WITH_ENROLLMENT_SAVE_START]: (state, action) => {
            const { uid } = action.payload;

            return {
                ...state,
                uid,
            };
        },
        [newPageActionTypes.CLEAN_UP_UID]: (state) => {
            const newState = { ...state };
            delete newState.uid;

            return {
                ...newState,
            };
        },
    },
    'newPage',
    initialNewPageState,
);
