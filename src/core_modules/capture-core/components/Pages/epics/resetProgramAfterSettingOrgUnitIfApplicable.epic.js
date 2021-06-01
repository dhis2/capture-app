// @flow
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import {
    resetProgramIdBase,
} from '../../LockedSelector/QuickSelector/actions/QuickSelector.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';

const programShouldReset = (orgUnitId, currentlySelectedProgramId) => {
    if (!currentlySelectedProgramId) {
        return false;
    }

    const program = programCollection.get(currentlySelectedProgramId);
    if (!program) {
        return true;
    }

    if (program.organisationUnits && program.organisationUnits[orgUnitId]) {
        return false;
    }

    return true;
};

export const resetProgramAfterSettingOrgUnitIfApplicableEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.ORG_UNIT_ID_SET),
        filter(({ payload: { orgUnitId } }) => {
            const currentlySelectedProgramId = store.value.currentSelections.programId;

            return programShouldReset(orgUnitId, currentlySelectedProgramId);
        }),
        map(() => resetProgramIdBase()));

