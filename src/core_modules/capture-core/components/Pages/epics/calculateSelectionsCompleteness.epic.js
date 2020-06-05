// @flow
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import {
    actionTypes as editEventPageSelectorActionTypes,
} from '../EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as viewEventPageSelectorActionTypes,
} from '../ViewEvent/ViewEventSelector/ViewEventSelector.actions';
import {
    urlActionTypes as newEnrollmentUrlActionTypes,
} from '../NewEnrollment';
import {
    selectionsCompletenessCalculated,
    actionTypes as crossPageActionTypes,
} from '../actions/crossPage.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';

type CurrentSelectionsState = {
    programId?: ?string,
    orgUnitId?: ?string,
    categories?: ?Object,
    categoryCheckInProgress?: ?boolean,
};

// eslint-disable-next-line complexity
const calculateCompleteStatus = (state: CurrentSelectionsState) => {
    if (!state.orgUnitId || !state.programId || state.categoryCheckInProgress) {
        return false;
    }

    const selectedProgram = state.programId && programs.get(state.programId);

    if (selectedProgram && selectedProgram.categoryCombination) {
        const categories = Array.from(selectedProgram.categoryCombination.categories.values());

        if (categories.some(category => !state.categories || !state.categories[category.id])) {
            return false;
        }
    }
    return true;
};

export const calculateSelectionsCompletenessEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        lockedSelectorActionTypes.SET_PROGRAM_ID,
        lockedSelectorActionTypes.SET_CATEGORY_OPTION,
        lockedSelectorActionTypes.VALID_SELECTIONS_FROM_URL,
        editEventPageSelectorActionTypes.SET_PROGRAM_ID,
        editEventPageSelectorActionTypes.SET_CATEGORY_OPTION,
        viewEventPageSelectorActionTypes.SET_PROGRAM_ID,
        viewEventPageSelectorActionTypes.SET_CATEGORY_OPTION,
        newEnrollmentUrlActionTypes.VALID_SELECTIONS_FROM_URL,
        crossPageActionTypes.AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET,
        crossPageActionTypes.AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET,
    )
        .map((action) => {
            const isComplete = calculateCompleteStatus(store.getState().currentSelections);
            return selectionsCompletenessCalculated(
                isComplete,
                (action.payload && action.payload.triggeringActionType) || action.type,
            );
        });
