declare module 'capture-core/components/NavigationBar/NavigationBar.container' {
    import { ComponentType } from 'react';

    export const NavigationBar: ComponentType<any>;
}

declare module 'capture-core/components/Pages/Search/SearchPage.component' {
    import { ComponentType } from 'react';

    export const SearchPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/Enrollment/Enrollment.component' {
    import { ComponentType } from 'react';

    export const EnrollmentPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/EnrollmentEditEvent/EnrollmentEditEventPage.component' {
    import { ComponentType } from 'react';

    export const EnrollmentEditEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/ViewEvent/ViewEventPage.component' {
    import { ComponentType } from 'react';

    export const ViewEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/EnrollmentEventView/ViewEnrollmentEventPage.component' {
    import { ComponentType } from 'react';

    export const ViewEnrollmentEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/NewEnrollmentEvent/EnrollmentEventNew.component' {
    import { ComponentType } from 'react';

    export const EnrollmentEventNew: ComponentType<any>;
}

declare module 'capture-core/components/Pages/EditEvent/EditEventPage.component' {
    import { ComponentType } from 'react';

    export const EditEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/New/NewEventPage.component' {
    import { ComponentType } from 'react';

    export const NewEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/WidgetEnrollmentEventNotes/WidgetEnrollmentEventNotesPage.component' {
    import { ComponentType } from 'react';

    export const WidgetEventNotesPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/WidgetEnrollmentData/WidgetEnrollmentDataPage.component' {
    import { ComponentType } from 'react';

    export const WidgetEnrollmentDataPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/WidgetRelationships/WidgetRelationshipsPage.component' {
    import { ComponentType } from 'react';

    export const WidgetRelationshipsPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/WidgetAssignee/WidgetAssigneeEventPage.component' {
    import { ComponentType } from 'react';

    export const WidgetAssigneeEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/WidgetAssignee/WidgetAssigneeEnrollmentPage.component' {
    import { ComponentType } from 'react';

    export const WidgetAssigneeEnrollmentPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/MainPage/MainPage.container' {
    import { ComponentType } from 'react';

    export const MainPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/ViewEvent' {
    import { ComponentType } from 'react';
    export const ViewEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/MainPage' {
    import { ComponentType } from 'react';
    export const MainPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/Search' {
    import { ComponentType } from 'react';
    export const SearchPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/New' {
    import { ComponentType } from 'react';
    export const NewPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/Enrollment' {
    import { ComponentType } from 'react';
    export const EnrollmentPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/StageEvent' {
    import { ComponentType } from 'react';
    export const StageEventListPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/EnrollmentEditEvent' {
    import { ComponentType } from 'react';
    export const EnrollmentEditEventPage: ComponentType<any>;
}

declare module 'capture-core/components/Pages/EnrollmentAddEvent' {
    import { ComponentType } from 'react';
    export const EnrollmentAddEventPage: ComponentType<any>;
}

declare module 'capture-core/components/LoadingMasks' {
    import { ComponentType } from 'react';

    export const LoadingMaskForPage: ComponentType<any>;
    export const LoadingMaskElementCenter: ComponentType<any>;
}

declare module 'capture-core/components/FeedbackBar' {
    import { ComponentType } from 'react';

    export const FeedbackBar: ComponentType<any>;
}

declare module 'capture-core/metaDataMemoryStores' {
    export const systemSettingsStore: {
        get: () => {
            dir: string;
        };
    };
}

declare module 'capture-core/components/RulesEngineVerboseInitializer' {
    import { ComponentType } from 'react';

    export const RulesEngineVerboseInitializer: ComponentType<any>;
}

declare module 'capture-core/components/MetadataAutoSelectInitializer' {
    import { ComponentType } from 'react';

    export const MetadataAutoSelectInitializer: ComponentType<any>;
}

declare module 'capture-core/utils/exceptions' {
    export class DisplayException extends Error {
        constructor(message: string, innerError?: Error);
        innerError?: Error;
    }
}

declare module 'capture-core/utils/routing' {
    export function useNavigate(): {
        navigate: (path: string, scrollToTop?: boolean) => void;
    };
}

declare module 'capture-core/utils/api' {
    export function makeQuerySingleResource(query: Function): (resourceQuery: any, variables?: any) => Promise<any>;
}

declare module 'capture-core/constants' {
    export const environments: {
        prod: string;
        dev: string;
        test: string;
    };
}

declare module 'capture-core-utils' {
    export function buildUrl(path: string, apiVersion: string): string;
}

declare module 'capture-core-utils/featuresSupport' {
    export function initFeatureAvailability(serverVersion: { minor: number }): void;
}

declare module 'capture-core/actions/actions.utils' {
    export function actionCreator(type: string): (payload?: any, meta?: any) => { type: string, payload?: any, meta?: any };
}

declare module 'capture-core/cleanUp/cleanUp' {
    export function cleanUpCommon(store: any): void;
}
