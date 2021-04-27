// @flow
import { ofType } from 'redux-observable';
import { flatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { successFetchEnrollment, widgetEnrollmentActionTypes } from './WidgetEnrollment.actions';


const enrollmentQuery = id => ({
    resource: 'trackedEntityInstances',
    id,
    params: {
        fields: ['enrollments'],
    },
});

const fetchEnrollmentStream = (teiId, querySingleResource) =>
    from(querySingleResource(enrollmentQuery(teiId))).pipe(
        map(({ enrollments }) =>
            successFetchEnrollment({ enrollments }),
        ));

export
const startFetchingEnrollmentEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(widgetEnrollmentActionTypes.ENROLLMENT_FETCH),
        flatMap(() => {
            const { query: { teiId } } = store.value.router.location;
            console.log(teiId);
            return fetchEnrollmentStream(teiId, querySingleResource);
            // return fetchEnrollmentStream('NpMOsS49kH2', querySingleResource);
            // return fetchEnrollmentStream('F8yKM85NbxW', programId, querySingleResource);
        }),
    );

