// @flow
import { actionTypes, loadCoreFailed } from './init.actions';
import getOrgUnitRootsActions from './getOrgUnitRootsActions';
import { loadCoreSuccessBatch } from './init.actionBatches';

export const loadCoreEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$
        .ofType(actionTypes.CORE_LOAD)
        .concatMap(() => getOrgUnitRootsActions()
            .then(rootsActions => loadCoreSuccessBatch(rootsActions))
            .catch(error => loadCoreFailed(error)));
