// @flow
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
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
    action$
        // $FlowSuppress
        .ofType(lockedSelectorActionTypes.ORG_UNIT_ID_SET)
        .filter((action) => {
            const orgUnitId = action.payload.id;
            const currentlySelectedProgramId = store.getState().currentSelections.programId;
            return programShouldReset(orgUnitId, currentlySelectedProgramId);
        })
        .map(() => resetProgramIdBase());

