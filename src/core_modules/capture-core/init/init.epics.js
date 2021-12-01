// @flow
import { concatMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { actionTypes, loadCoreFailed } from './init.actions';
import { loadCoreSuccessBatch } from './init.actionBatches';
import { getOrgUnitRootsActions } from './getOrgUnitRootsActions';

export const loadCoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(actionTypes.CORE_LOAD),
        concatMap(() => getOrgUnitRootsActions()
            .then(rootsActions => loadCoreSuccessBatch(rootsActions))
            .catch(error => loadCoreFailed(error))));
