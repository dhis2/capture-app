// @flow
import { ofType } from 'redux-observable';
import i18n from '@dhis2/d2-i18n';
import { catchError, flatMap, map, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
    enrollmentEventEditPagePageActionTypes,
    showErrorViewOnEnrollmentEventEditPage,
    showLoadingViewOnEnrollmentEventEditPage,
    successfulFetchingEventInformation,
} from './EnrollmentEventEditPage.actions';

export const fetchEventInformationEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(enrollmentEventEditPagePageActionTypes.EVENT_START_FETCH),
        flatMap(() => {
            const { query: { eventId } } = store.value.router.location;

            return from(querySingleResource({ resource: 'events', id: eventId }))
                .pipe(
                    map(() => successfulFetchingEventInformation()),
                    catchError(() => {
                        const error = i18n.t('Enrollment with id "{{eventId}}" does not exist', { eventId });
                        return of(showErrorViewOnEnrollmentEventEditPage({ error }));
                    }),
                    startWith(showLoadingViewOnEnrollmentEventEditPage()),
                );
        }),
    );
