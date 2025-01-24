// @flow
import type { QuerySingleResource } from '../utils/api/api.types';

declare type D2 = {
    models: Object,
    system: {
        settings: {
            all: () => Object,
        },
        systemInfo: {
            dateFormat: string,
        },
    },
    i18n: Object,
    currentUser: {
        authorities: Set<string>,
        userRoles: Array<string>,
        id: string,
    },
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
    +value: ReduxState,
    +dispatch: ReduxDispatch,
    +getState: () => ReduxState
}

// Events
declare type CaptureClientEvent = {
    eventId: string,
    programId: string,
    programStageId: string,
    orgUnitId: string,
    trackedEntityInstanceId?: string,
    enrollmentId?: string,
    enrollmentStatus?: string,
    status: 'ACTIVE' | 'COMPLETED' | 'VISITED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    occurredAt: string,
    scheduledAt: string,
    completedAt: string,
    attributeCategoryOptions?: string,
};

// ClientValues
declare type UserFormValue = {
    id: string,
    username: string,
    name: string,
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
            lightest: string,
            lighter: string,
            light: string,
            main: string,
            dark: string,
            contrastText: string,
        },
        error: {
            red200: string,
            lighter: string,
            light: string,
            main: string,
            dark: string,
            contrastText: string,
        },
        warning: {
            lighter: string,
            light: string,
            main: string,
            dark: string,
        },
        grey: {
            lightest: string,
            lighter: string,
            light: string,
            main: string,
            dark: string,
            blueGrey: string,
            snow: string,
            black: string,
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
        dividerDarker: string,
        dividerLighter: string,
        dividerForm: string,
        accent: {
            lighter: string,
            light: string,
            main: string,
            dark: string,
        },
        required: string,
        info: {
            main: string,
        },
        success: {
            main: string,
            green600: string,
        }
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
        fontWeightMedium: number,
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

declare type Epic = (action$: rxjs$Observable<any>, store: ReduxStore)=>rxjs$Observable<any>;
declare type InputObservable = any;
declare type Stream = rxjs$Observable<any>;

declare class process {
    static env: {
        NODE_ENV: string,
        NODE_PATH: string,
        REACT_APP_CACHE_VERSION: string,
        REACT_APP_SERVER_VERSION: string,
        REACT_APP_VERSION: string,
        REACT_APP_DHIS2_API_VERSION: string,
    }
}

declare type CssClasses = {|
    +classes: Object,
|};

declare type ApiUtilsWithoutHistory = {|
    querySingleResource: QuerySingleResource,
    mutate: DataEngineMutate,
    absoluteApiPath: string,
    serverVersion: { minor: number },
|}

declare type ApiUtils = {|
    querySingleResource: QuerySingleResource,
    mutate: DataEngineMutate,
    absoluteApiPath: string,
    serverVersion: { minor: number },
    history: {
        push: () => void,
        ...PassOnProps,
    },
|};
