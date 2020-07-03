// @flow
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
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

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(
        lockedSelectorActionTypes.PROGRAM_ID_SET,
        lockedSelectorActionTypes.CATEGORY_OPTION_SET,
        lockedSelectorActionTypes.SELECTIONS_FROM_URL_VALID,
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
