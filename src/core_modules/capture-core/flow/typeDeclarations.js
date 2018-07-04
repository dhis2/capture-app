// @flow
/* eslint-disable */
import type { Store } from 'redux';
import { methods } from '../src/trackerOffline/trackerOfflineConfig.const';

declare type D2 = {
    models: Object,
    system: {
        settings: {
            all: () => Object,
        }
    },
    i18n: Object,
    Api: {
        getApi: () => Object
    }
};

// Redux
declare type ReduxAction<Payload, Meta> = {
    type: string,
    payload: Payload,
    meta: Meta,
};

declare type ReduxState = Object;
declare type ReduxDispatch = (action: {
    type: string,
    [props: string]: any,
}) => void;

declare type ReduxStore = {
    getState: () => ReduxState,
    dispatch: ReduxDispatch
}

// Events
declare type Event = {
    eventId: string,
    programId: string,
    programStageId: string,
    orgUnitId: string,
    orgUnitName: string,
    trackedEntityInstanceId?: string,
    enrollmentId?: string,
    enrollmentStatus?: string,
    status: string,
    eventDate: string,
    dueDate: string,
    completedDate: string,
};

declare type UiEventData = {
    target: {
        value: any
    }
};

declare type Theme = {
    palette: Object,
    typography: {
        pxToRem: (size: number) => string,
        title: Object,
    },
    spacing: {
        unit: number,
    },
    direction: string,
};

declare type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

// Redux Offline
declare type OfflineEffect = {
    url: string,
    data: any,
    method: $Values<typeof methods>,
};