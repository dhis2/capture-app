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
    urlActionTypes as newEnrollmentUrlActionTypes,
} from '../NewEnrollment';


import { selectionsCompletenessCalculated } from '../actions/crossPage.actions';

type CurrentSelectionsState = {
    programId?: ?string,
    orgUnitId?: ?string,
    categories?: ?Object,
};

const calculateCompleteStatus = (state: CurrentSelectionsState) => {
    if (!state.orgUnitId || !state.programId) {
        return false;
    }

    const selectedProgram = state.programId && programs.get(state.programId);

    if (selectedProgram && selectedProgram.categoryCombination) {
        const categories = selectedProgram.categoryCombination.categories;

        if (categories.some(category => !state.categories || !state.categories[category.id])) {
            return false;
        }
    }
    return true;
};

export const calculateSelectionsCompletenessEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        mainSelections.UPDATE_MAIN_SELECTIONS,
        mainSelections.VALID_SELECTIONS_FROM_URL,
        newEventDataEntryUrlActionTypes.VALID_SELECTIONS_FROM_URL,
        mainPageSelectorActionTypes.SET_ORG_UNIT,
        mainPageSelectorActionTypes.SET_PROGRAM_ID,
        mainPageSelectorActionTypes.SET_CATEGORY_OPTION,
        editEventPageSelectorActionTypes.SET_ORG_UNIT,
        editEventPageSelectorActionTypes.SET_PROGRAM_ID,
        editEventPageSelectorActionTypes.SET_CATEGORY_OPTION,
        newEventSelectorActionTypes.SET_ORG_UNIT,
        newEventSelectorActionTypes.SET_PROGRAM_ID,
        newEventSelectorActionTypes.SET_CATEGORY_OPTION,
        newEnrollmentUrlActionTypes.VALID_SELECTIONS_FROM_URL,
    )
        .map(() => {
            const isComplete = calculateCompleteStatus(store.getState().currentSelections);
            return selectionsCompletenessCalculated(isComplete);
        });
