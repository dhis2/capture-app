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
declare type CaptureClientEvent = {
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
    attributeCategoryOptions?: ?string,
};

declare type UiEventData = {
    target: {
        value: any
    }
};

declare type Theme = {
    palette: {
        common: {
            black: string,
            white: string,
        },
        type: string,
        primary: {
            light: string,
            main: string,
            dark: string,
            contrastText: string,
        },
        secondary: {
            light: string,
            main: string,
            dark: string,
            contrastText: string,
        },
        error: {
            light: string,
            main: string,
            dark: string,
            contrastText: string,
        },
        warning: {
            light: string,
            main: string,
            dark: string,
        },
        grey: {
            '50': string,
            '100': string,
            '200': string,
            '300': string,
            '400': string,
            '500': string,
            '600': string,
            '700': string,
            '800': string,
            '900': string,
            A100: string,
            A200: string,
            A400: string,
            A700: string,
        },
        text: {
            primary: string,
            secondary: string,
            disabled: string,
            hint: string,
        },
        background: {
            paper: string,
            default: string,
        },
        divider: string,
        dividerForm: string,
        accent: {
            lighter: string,
            light: string,
            main: string,
            dark: string,
        },
    },
    typography: {
        pxToRem: (size: number) => string,
        title: {
            fontSize: string,
            fontWeight: number,
            fontFamily: string,
            lineHeight: string,
            color: string,
        },
        caption: {
            fontSize: string,
            fontWeight: number,
            fontFamily: string,
            lineHeight: string,
            color: string,
        },
        body1: {
            fontSize: string,
            fontWeight: number,
            fontFamily: string,
            lineHeight: string,
            color: string,
        },
        body2: {
            fontSize: string,
            fontWeight: number,
            fontFamily: string,
            lineHeight: string,
            color: string,
        },
    },
    spacing: {
        unit: number,
    },
    direction: string,
    breakpoints: {
        up: (string | number) => string,
        down: (string | number) => string,
        between: (string | number) => string,
        only: (string | number) => string,
    },
};

declare type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

// Redux Offline
declare type OfflineEffect = {
    url: string,
    data: any,
    method: $Values<typeof methods>,
};