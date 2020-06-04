// @flow
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../Pages/MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../Pages/EditEvent/EditEventSelector/EditEventSelector.actions';
import {
    actionTypes as viewEventSelectorActionTypes,
} from '../../Pages/ViewEvent/ViewEventSelector/ViewEventSelector.actions';


import {
    resetProgramIdBase,
} from '../../LockedSelector/QuickSelector/actions/QuickSelector.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';

const programShouldReset = (orgUnitId, currentlySelectedProgramId) => {
    if (!currentlySelectedProgramId) {
        return false;
    }

    const program = programs.get(currentlySelectedProgramId);
    if (!program) {
        return true;
    }

    if (program.organisationUnits && program.organisationUnits[orgUnitId]) {
        return false;
    }

    return true;
};

export const resetProgramAfterSettingOrgUnitIfApplicableEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$
        .ofType(
            lockedSelectorActionTypes.SET_ORG_UNIT,

            mainPageSelectorActionTypes.SET_ORG_UNIT,
            editEventSelectorActionTypes.SET_ORG_UNIT,
            viewEventSelectorActionTypes.SET_ORG_UNIT,
            lockedSelectorActionTypes.SET_ORG_UNIT,
        )
        .filter((action) => {
            const orgUnitId = action.payload.id;
            const currentlySelectedProgramId = store.getState().currentSelections.programId;
            return programShouldReset(orgUnitId, currentlySelectedProgramId);
        })
        .map(() => resetProgramIdBase());

