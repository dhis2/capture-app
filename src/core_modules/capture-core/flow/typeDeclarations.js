// @flow
import { dataElementTypes } from '../metaData';

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
    Api: {
        getApi: () => Object
    },
    currentUser: {
        authorities: Set<string>,
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
    value: ReduxState,
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

declare class process {
    static env: {
        NODE_ENV: string,
        NODE_PATH: string,
        REACT_APP_CACHE_VERSION: string,
        REACT_APP_VERSION: string,
        REACT_APP_DHIS2_API_VERSION: string,
    }
}

declare type DataElementTypes = $Keys<typeof dataElementTypes>
