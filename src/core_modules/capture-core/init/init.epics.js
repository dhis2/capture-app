// @flow
import { ofType } from 'redux-observable';
import { concatMap } from 'rxjs/operators';
import { getOrgUnitRootsActions } from './getOrgUnitRootsActions';
import { loadCoreSuccessBatch } from './init.actionBatches';
import { actionTypes, loadCoreFailed } from './init.actions';

export const loadCoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(actionTypes.CORE_LOAD),
        concatMap(() => getOrgUnitRootsActions()
            .then(rootsActions => loadCoreSuccessBatch(rootsActions))
            .catch(error => loadCoreFailed(error))));
