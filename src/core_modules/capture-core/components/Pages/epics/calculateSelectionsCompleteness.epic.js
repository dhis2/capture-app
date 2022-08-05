// @flow
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { ofType } from 'redux-observable';
import { filter, map } from 'rxjs/operators';
import {
    calculateSelectionsCompleteness,
    actionTypes as crossPageActionTypes,
} from '../actions/crossPage.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';
import { scopeSelectorActionTypes } from '../../ScopeSelector';
import { getLocationPathname, pageFetchesOrgUnitUsingTheOldWay } from '../../../utils/url';

type CurrentSelectionsState = {
    programId?: ?string,
    orgUnitId?: ?string,
    showaccesible: boolean,
    categories?: ?Object,
    categoryCheckInProgress?: ?boolean,
};

const calculateCompleteStatus = (state: CurrentSelectionsState) => {
    if (!state.orgUnitId || !state.programId || state.categoryCheckInProgress) {
        return false;
    }

    const selectedProgram = state.programId && programCollection.get(state.programId);

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
            scopeSelectorActionTypes.CATEGORY_OPTION_SET,
            lockedSelectorActionTypes.FROM_URL_CURRENT_SELECTIONS_VALID,
            crossPageActionTypes.AFTER_SETTING_ORG_UNIT_SKIP_CATEGORIES_RESET,
            crossPageActionTypes.AFTER_SETTING_ORG_UNIT_DO_CATEGORIES_RESET,
            crossPageActionTypes.UPDATE_SHOW_ACCESSIBLE_STATUS,
        ),
        filter(() => {
            const pathname = getLocationPathname();
            return pageFetchesOrgUnitUsingTheOldWay(pathname.substring(1));
        }),
        map((action) => {
            const isComplete = calculateCompleteStatus(store.value.currentSelections);
            return calculateSelectionsCompleteness(
                isComplete,
                (action.payload && action.payload.triggeringActionType) || action.type,
            );
        }));
