import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { loadCore, actionTypes as coreActionTypes } from 'capture-core/init';
import { loadAppSuccess, appStartActionTypes } from './appStart.actions';

export const triggerLoadCoreEpic = (action$: any) =>
    action$.pipe(
        ofType(appStartActionTypes.APP_LOAD),
        map(() => loadCore()));

export const loadAppEpic = (action$: any) =>
    action$.pipe(
        ofType(coreActionTypes.CORE_LOAD),
        map(() => loadAppSuccess({
            headerBarHeight: 48,
        })));
