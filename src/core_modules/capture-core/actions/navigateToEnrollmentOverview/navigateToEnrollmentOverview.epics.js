// @flow

import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { actionTypes as NavigateToEnrollmentOverviewActionTypes } from './navigateToEnrollmentOverview.actions';
import { buildUrlQueryString } from '../../utils/routing';

// TODO does this epic make sense and the NAVIGATE_TO_ENROLLMENT_OVERVIEW actionnstill make sense?
export const navigateToEnrollmentOverviewEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(NavigateToEnrollmentOverviewActionTypes.NAVIGATE_TO_ENROLLMENT_OVERVIEW),
        switchMap((action) => {
            const { teiId, programId, orgUnitId } = action.payload;
            const enrollmentId = programId && (action.payload?.enrollmentId || 'AUTO');

            history.push(
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
