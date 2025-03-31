import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { loadCore, actionTypes as coreActionTypes } from 'capture-core/init';
import { loadAppSuccess, appStartActionTypes } from './appStart.actions';
import { InputObservable } from '../../types/global.types';

export const triggerLoadCoreEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(appStartActionTypes.APP_LOAD),
        map(() => loadCore()));

export const loadAppEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(coreActionTypes.CORE_LOAD),
        map(() => loadAppSuccess({
            headerBarHeight: 48,
        })));
