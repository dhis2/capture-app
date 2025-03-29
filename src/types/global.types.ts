import '@dhis2/app-runtime';

export type QuerySingleResource = (resourceQuery: any, variables?: any) => Promise<any>;

export interface ReduxAction<Payload, Meta> {
    type: string;
    payload: Payload;
    meta: Meta;
}

export type ReduxState = Object;

export interface ReduxDispatch {
    (action: {
        type: string;
        [props: string]: any;
    }): void;
}

export interface ReduxStore {
    readonly value: ReduxState;
    readonly dispatch: ReduxDispatch;
    readonly getState: () => ReduxState;
}

export interface CaptureClientEvent {
    eventId: string;
    programId: string;
    programStageId: string;
    orgUnitId: string;
    trackedEntityInstanceId?: string;
    enrollmentId?: string;
    enrollmentStatus?: string;
    status: 'ACTIVE' | 'COMPLETED' | 'VISITED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED';
    occurredAt: string;
    scheduledAt: string;
    completedAt: string;
    attributeCategoryOptions?: string;
}

export interface UserFormValue {
    id: string;
    username: string;
    name: string;
}

export interface UiEventData {
    target: {
        value: any
    }
}

export interface D2 {
    models: Object;
    system: {
        settings: {
            all: () => Object;
        };
        systemInfo: {
            dateFormat: string;
        };
    };
    i18n: Object;
    currentUser: {
        authorities: Set<string>;
        userRoles: Array<string>;
        id: string;
    };
}

export interface Theme {
    palette: {
        common: {
            black: string;
            white: string;
        };
        type: string;
        primary: {
            light: string;
            main: string;
            dark: string;
            contrastText: string;
        };
        secondary: {
            lightest: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            contrastText: string;
        };
        error: {
            red200: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            contrastText: string;
        };
        warning: {
            lighter: string;
            light: string;
            main: string;
            dark: string;
        };
        grey: {
            lightest: string;
            lighter: string;
            light: string;
            main: string;
            dark: string;
            blueGrey: string;
            snow: string;
            black: string;
        };
        text: {
            primary: string;
            secondary: string;
            disabled: string;
            hint: string;
        };
        background: {
            paper: string;
            default: string;
        };
        divider: string;
        dividerDarker: string;
        dividerLighter: string;
        dividerForm: string;
        accent: {
            lighter: string;
            light: string;
            main: string;
            dark: string;
        };
        required: string;
        info: {
            main: string;
        };
        success: {
            main: string;
            green600: string;
        }
    };
    typography: {
        pxToRem: (size: number) => string;
        title: {
            fontSize: string;
            fontWeight: number;
            fontFamily: string;
            lineHeight: string;
            color: string;
        };
        caption: {
            fontSize: string;
            fontWeight: number;
            fontFamily: string;
            lineHeight: string;
            color: string;
        };
        body1: {
            fontSize: string;
            fontWeight: number;
            fontFamily: string;
            lineHeight: string;
            color: string;
        };
        fontWeightMedium: number;
    };
    spacing: {
        unit: number;
    };
    direction: string;
    breakpoints: {
        up: (value: string | number) => string;
        down: (value: string | number) => string;
        between: (value: string | number) => string;
        only: (value: string | number) => string;
    };
}

export interface CssClasses {
    readonly classes: Object;
}

export interface ApiUtilsWithoutHistory {
    querySingleResource: QuerySingleResource;
    mutate: DataEngineMutate;
    absoluteApiPath: string;
    serverVersion: { minor: number };
    fromClientDate: (date?: string | Date | number | null) => any;
}

export interface ApiUtils {
    querySingleResource: QuerySingleResource;
    mutate: DataEngineMutate;
    absoluteApiPath: string;
    serverVersion: { minor: number };
    navigate: (path: string, scrollToTop?: boolean) => void;
    fromClientDate: (date?: string | Date | number | null) => any;
}

export interface DataEngineMutate {
    (input: any): Promise<any>;
}

export type Epic = (action$: any, store: ReduxStore) => any;
export type InputObservable = any;
export type Stream = any;

declare global {
    interface Process {
        env: {
            NODE_ENV: string;
            NODE_PATH: string;
            REACT_APP_CACHE_VERSION: string;
            REACT_APP_SERVER_VERSION: string;
            REACT_APP_VERSION: string;
            REACT_APP_DHIS2_API_VERSION: string;
        }
    }
}
