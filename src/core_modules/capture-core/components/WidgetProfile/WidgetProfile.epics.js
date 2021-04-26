// @flow
import { ofType } from 'redux-observable';
import { flatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { successFetchProfile, profileWidgetActionTypes } from './WidgetProfile.actions';


const profileQuery = (id, programId) => ({
    resource: 'trackedEntityInstances',
    id,
    params: {
        program: programId,
    },
});


const fetchProfileStream = (teiId, programId, querySingleResource) =>
    from(querySingleResource(profileQuery(teiId, programId)))
        .pipe(
            map(({ attributes }) => successFetchProfile({
                attributes: (attributes ?? []).reverse(),
            })),
        );


export const startFetchingProfileEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(profileWidgetActionTypes.INFORMATION_FETCH),
        flatMap(() => {
            const { query: { teiId } } = store.value.router.location;
            const { enrollments } = store.value.enrollmentPage;
            const programId = enrollments[0].program;
            return fetchProfileStream(teiId, programId, querySingleResource);
        }),
    );

