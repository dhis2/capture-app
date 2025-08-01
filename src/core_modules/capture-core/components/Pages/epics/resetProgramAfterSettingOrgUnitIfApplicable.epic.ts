import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import {
    resetProgramIdBase,
} from '../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';
import { scopeSelectorActionTypes } from '../../ScopeSelector';
import type { ReduxStore, EpicAction } from '../../../../capture-core-utils/types';

const programShouldReset = (orgUnitId: string, currentlySelectedProgramId: string | null | undefined) => {
    if (!currentlySelectedProgramId) {
        return false;
    }

    const program = programCollection.get(currentlySelectedProgramId);
    if (!program) {
        return true;
    }

    if (program.organisationUnits?.[orgUnitId]) {
        return false;
    }

    return true;
};

export const resetProgramAfterSettingOrgUnitIfApplicableEpic = (action$: EpicAction<any>, store: ReduxStore) =>
    action$.pipe(
        ofType(
            scopeSelectorActionTypes.ORG_UNIT_ID_SET,
        ),
        filter(({ payload: { orgUnitId } }) => {
            const currentlySelectedProgramId = store.value.currentSelections.programId;

            return programShouldReset(orgUnitId, currentlySelectedProgramId);
        }),
        map(() => resetProgramIdBase()));

