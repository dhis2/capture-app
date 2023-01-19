// @flow
import { ofType } from 'redux-observable';
import { flatMap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { buildUrlQueryString } from '../../utils/routing';
import {
    navigateToEnrollmentOverview,
} from '../../actions/navigateToEnrollmentOverview/navigateToEnrollmentOverview.actions';
import { scopeSelectorActionTypes } from './ScopeSelector.actions';

export const cancelContextChangeEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { history }: ApiUtils,
) =>
    action$.pipe(
        ofType(scopeSelectorActionTypes.CANCEL_CONTEXT_CHANGE),
        flatMap(() => {
            const {
                app: { savedContext },
                currentSelections: { orgUnitId: orgUnitSelectionId, programId: programSelectionId },
            } = store.value;
            if (!savedContext) {
                history.push(`/?programId=${programSelectionId}&orgUnitId=${orgUnitSelectionId}`);
                return EMPTY;
            }

            const { programId, teiId, orgUnitId, enrollmentId, stageId, redirectToEnrollmentEventNew } = savedContext;
            if (redirectToEnrollmentEventNew) {
                history.push(
                    `/enrollmentEventNew?${buildUrlQueryString({
                        programId,
                        orgUnitId,
                        teiId,
                        enrollmentId,
                        stageId,
                    })}`,
                );
                return EMPTY;
            }


            return of(navigateToEnrollmentOverview({
                orgUnitId,
                programId,
                teiId,
            }));
        }),
    );
