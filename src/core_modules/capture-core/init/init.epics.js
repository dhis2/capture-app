// @flow
import { actionTypes, loadCoreFailed } from './init.actions';
import { ofType } from 'redux-observable';
import { concatMap } from 'rxjs/operators';
import getOrgUnitRootsActions from './getOrgUnitRootsActions';
import { loadCoreSuccessBatch } from './init.actionBatches';

export const loadCoreEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(actionTypes.CORE_LOAD),
        concatMap(() => getOrgUnitRootsActions()
            .then(rootsActions => loadCoreSuccessBatch(rootsActions))
            .catch(error => loadCoreFailed(error))));
