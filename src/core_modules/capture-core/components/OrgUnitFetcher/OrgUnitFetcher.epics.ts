import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { getCoreOrgUnit } from '../../metadataRetrieval/coreOrgUnit';
import { actionTypes, setCurrentOrgUnit, errorRetrievingOrgUnit } from './OrgUnitFetcher.actions';
import type { FetchOrgUnitActionPayload } from './OrgUnitFetcher.types';
import type { EpicAction } from '../../../capture-core-utils/types';

export const orgUnitFetcherEpic = (
    action$: EpicAction<FetchOrgUnitActionPayload>,
) => action$.pipe(
    ofType(actionTypes.FETCH_ORG_UNIT),
    map(({ payload: { orgUnitId } }) => getCoreOrgUnit({
        orgUnitId,
        onSuccess: orgUnit => setCurrentOrgUnit(orgUnit),
        onError: errorRetrievingOrgUnit,
    })),
);
