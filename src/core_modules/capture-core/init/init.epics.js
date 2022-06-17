// @flow
import { ofType } from 'redux-observable';
import { concatMap } from 'rxjs/operators';
import { actionTypes, loadCoreFailed, setCurrentUser } from './init.actions';
import { loadCoreSuccessBatch } from './init.actionBatches';

export const loadCoreEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(actionTypes.CORE_LOAD),
        concatMap(() => querySingleResource({
            resource: 'me',
            params: {
                fields: 'firstName,surname,username,organisationUnits[id],userGroups[id],userRoles[id]',
            },
        })
            .then(currentUser => loadCoreSuccessBatch(setCurrentUser(currentUser)))
            .catch(error => loadCoreFailed(error))));
