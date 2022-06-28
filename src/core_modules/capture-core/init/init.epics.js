// @flow
import { ofType } from 'redux-observable';
import { concatMap } from 'rxjs/operators';
import { actionTypes, loadCoreFailed, setOrgUnitRoot } from './init.actions';
import { loadCoreSuccessBatch } from './init.actionBatches';

export const loadCoreEpic = (action$: InputObservable, store: ReduxStore, { querySingleResource }: ApiUtils) =>
    action$.pipe(
        ofType(actionTypes.CORE_LOAD),
        concatMap(() => querySingleResource({
            resource: 'me',
            params: {
                fields: 'organisationUnits[id]',
            },
        })
            .then(({ organisationUnits }) => loadCoreSuccessBatch(setOrgUnitRoot(organisationUnits)))
            .catch(error => loadCoreFailed(error))));
