// @flow
import { ofType } from 'redux-observable';
import { concatMap } from 'rxjs/operators';
import { actionTypes, loadCoreFailed } from './init.actions';
import getOrgUnitRootsActions from './getOrgUnitRootsActions';
import { loadCoreSuccessBatch } from './init.actionBatches';

// $FlowFixMe[cannot-resolve-name] automated comment
export const loadCoreEpic = (action$: ActionsObservable) =>
    action$.pipe(
        ofType(actionTypes.CORE_LOAD),
        concatMap(() => getOrgUnitRootsActions()
            .then(rootsActions => loadCoreSuccessBatch(rootsActions))
            .catch(error => loadCoreFailed(error))));
