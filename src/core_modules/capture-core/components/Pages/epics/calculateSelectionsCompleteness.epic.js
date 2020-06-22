// @flow
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';

import { actionTypes as mainSelections } from '../MainPage/mainSelections.actions';
import {
    dataEntryUrlActionTypes as newEventDataEntryUrlActionTypes,
    selectorActionTypes as newEventSelectorActionTypes,
} from '../NewEvent';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../MainPage/MainPageSelector/MainPageSelector.actions';
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

type CurrentSelectionsState = {
    programId?: ?string,
    orgUnitId?: ?string,
    categories?: ?Object,
    categoryCheckInProgress?: ?boolean,
};

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

// todo file not used!
export const calculateSelectionsCompletenessEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        mainSelections.UPDATE_MAIN_SELECTIONS,
        mainSelections.VALID_SELECTIONS_FROM_URL,
        newEventDataEntryUrlActionTypes.VALID_SELECTIONS_FROM_URL,
        mainPageSelectorActionTypes.SET_PROGRAM_ID,
        mainPageSelectorActionTypes.SET_CATEGORY_OPTION,
        editEventPageSelectorActionTypes.SET_PROGRAM_ID,
        editEventPageSelectorActionTypes.SET_CATEGORY_OPTION,
        viewEventPageSelectorActionTypes.SET_PROGRAM_ID,
        viewEventPageSelectorActionTypes.SET_CATEGORY_OPTION,
        newEventSelectorActionTypes.SET_PROGRAM_ID,
        newEventSelectorActionTypes.SET_CATEGORY_OPTION,
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
