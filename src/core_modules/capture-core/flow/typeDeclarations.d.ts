import { QuerySingleResource } from '../utils/api/api.types';
import { DHIS2Date } from '@dhis2/app-runtime';
import { Observable } from 'rxjs';
import { Store } from 'redux';

declare global {
    interface D2 {
        models: Record<string, unknown>;
        system: {
            settings: {
                all: () => Record<string, unknown>;
            };
            systemInfo: {
                dateFormat: string;
            };
        };
        i18n: Record<string, unknown>;
        currentUser: {
            authorities: Set<string>;
            userRoles: string[];
            id: string;
        };
    }

    type ReduxAction<Payload, Meta> = {
        type: string;
        payload: Payload;
        meta: Meta;
    };

    type ReduxState = Record<string, any>;

    type ReduxDispatch = (action: {
        type: string;
        [props: string]: any;
    }) => void;

    type ReduxStore = Store & {
        value: ReduxState;
        dispatch: ReduxDispatch;
        getState: () => ReduxState;
        [Symbol.observable]: () => Observable<ReduxState>;
    };

    type StateObservable = {
        value: ReduxState;
    };

    type CaptureClientEvent = {
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
    };

    type UserFormValue = {
        id: string;
        username: string;
        name: string;
    };

    type UiEventData = {
        target: {
            value: unknown;
        };
    };

    type Theme = {
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
            };
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
            up: (key: string | number) => string;
            down: (key: string | number) => string;
            between: (start: string | number) => string;
            only: (key: string | number) => string;
        };
    };

    type Epic = (action$: Observable<unknown>, store: ReduxStore | StateObservable) => Observable<unknown>;
    type InputObservable = Observable<unknown>;
    type Stream = Observable<unknown>;

    interface ProcessEnv {
        NODE_ENV: string;
        NODE_PATH: string;
        REACT_APP_CACHE_VERSION: string;
        REACT_APP_SERVER_VERSION: string;
        REACT_APP_VERSION: string;
        REACT_APP_DHIS2_API_VERSION: string;
    }

    interface CssClasses {
        classes: Record<string, unknown>;
    }

    interface ApiUtilsWithoutHistory {
        querySingleResource: QuerySingleResource;
        mutate: DataEngineMutate;
        absoluteApiPath: string;
        serverVersion: { minor: number };
        fromClientDate: (date?: string | Date | number | null) => DHIS2Date;
    }

    interface ApiUtils extends ApiUtilsWithoutHistory {
        navigate: (path: string, scrollToTop?: boolean) => void;
    }
}

export {}; 