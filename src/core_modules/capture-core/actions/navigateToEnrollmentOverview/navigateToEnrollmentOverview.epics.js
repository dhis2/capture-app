// @flow

import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { actionTypes as NavigateToEnrollmentOverviewActionTypes } from './navigateToEnrollmentOverview.actions';
import { buildUrlQueryString } from '../../utils/routing';

export const navigateToEnrollmentOverviewEpic = (action$: InputObservable, store: ReduxStore, { navigate }: ApiUtils) =>
    action$.pipe(
        ofType(NavigateToEnrollmentOverviewActionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW),
        switchMap((action) => {
            const { teiId, programId, orgUnitId } = action.payload;
            const enrollmentId = programId && (action.payload?.enrollmentId || 'AUTO');
            navigate(
                `/enrollment?${buildUrlQueryString({
                    teiId,
                    programId,
                    orgUnitId,
                    enrollmentId,
                })}`,
            );
            return EMPTY;
        }),
    );
