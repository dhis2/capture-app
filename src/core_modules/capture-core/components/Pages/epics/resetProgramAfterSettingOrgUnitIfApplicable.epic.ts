import { programCollection } from '../../../metaDataMemoryStores/programCollection/programCollection';
import { ofType, Epic } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import {
    resetProgramIdBase,
} from '../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';
import { scopeSelectorActionTypes } from '../../ScopeSelector';

type ReduxState = {
    currentSelections: {
        programId: string | null | undefined;
        [key: string]: unknown;
    };
};

type OrgUnitSetAction = {
    type: typeof scopeSelectorActionTypes.ORG_UNIT_ID_SET;
    payload: {
        orgUnitId: string;
    };
};

type AnyAction = {
    type: string;
    payload?: any;
    meta?: any;
    error?: any;
};

const programShouldReset = (orgUnitId: string, currentlySelectedProgramId: string | null | undefined): boolean => {
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

export const resetProgramAfterSettingOrgUnitIfApplicableEpic: Epic<AnyAction, AnyAction, ReduxState> = (action$, state$) =>
    action$.pipe(
        ofType(
            scopeSelectorActionTypes.ORG_UNIT_ID_SET,
        ),
        filter((action) => {
            const orgUnitId = (action as OrgUnitSetAction).payload.orgUnitId;
            const currentlySelectedProgramId = state$.value.currentSelections.programId;
            return programShouldReset(orgUnitId, currentlySelectedProgramId);
        }),
        map(() => resetProgramIdBase())); 