// @flow
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { ofType } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import {
    calculateSelectionsCompleteness,
    actionTypes as crossPageActionTypes,
} from '../actions/crossPage.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';
import { pageIsUsingTheOldWayOfRendering, pageIsUsingTheStandardRouter } from '../../LockedSelector/LockedSelector.epics';

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

export const calculateSelectionsCompletenessEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            lockedSelectorActionTypes.PROGRAM_ID_SET,
            lockedSelectorActionTypes.CATEGORY_OPTION_SET,
            lockedSelectorActionTypes.CURRENT_SELECTIONS_VALID,
            crossPageActionTypes.AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET,
            crossPageActionTypes.AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET,
        ),
        filter(() => {
            const { pathname } = store.value.router.location;
            const is = pageIsUsingTheStandardRouter(pathname.substring(1));
            return !is;
        }),
        map((action) => {
            const isComplete = calculateCompleteStatus(store.value.currentSelections);
            return calculateSelectionsCompleteness(
                isComplete,
                (action.payload && action.payload.triggeringActionType) || action.type,
            );
        }));
