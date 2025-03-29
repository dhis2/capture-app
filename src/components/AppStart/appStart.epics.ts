import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { appStartActionTypes, loadAppSuccess } from './appStart.actions';
import { Epic } from '../../types/global.types';

export const loadAppEpic: Epic = action$ => action$.pipe(
    ofType(appStartActionTypes.APP_LOAD),
    map(() => loadAppSuccess({})),
);

export const epics = [
    loadAppEpic,
];
