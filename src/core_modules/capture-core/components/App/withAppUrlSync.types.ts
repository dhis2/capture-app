import type { ReactNode } from 'react';
import type { UpdateDataContainer } from '../UrlSync/withUrlSync';

export type ReduxState = {
    app: {
        page?: string;
        locationSwitchInProgress?: boolean;
    };
    currentSelections: {
        programId?: string;
        trackedEntityTypeId?: string;
        orgUnitId?: string;
    };
    viewEventPage: {
        eventId?: string;
        loadedValues?: {
            eventContainer?: {
                event?: any;
                values?: any;
            };
        };
        eventDetailsSection?: {
            loading?: boolean;
        };
    };
    editEventPage: {
        eventId?: string;
    };
    activePage: {
        viewEventLoadError?: {
            error?: string;
        };
        lockedSelectorLoads?: boolean;
        isDataEntryLoading?: boolean;
    };
    newRelationshipRegisterTei: {
        programId: string;
        orgUnit: { id: string };
        dataEntryError?: string;
    };
    newRelationship: {
        selectedRelationshipType: {
            to: { trackedEntityTypeId: string };
        };
    };
};

export type ReduxDispatch = (action: {
    type: string;
    [props: string]: any;
}) => void;

export type Props = {
    location: {
        search: string;
        pathname: string;
    };
    onUpdateFromUrl: (page: string | undefined, data: UpdateDataContainer) => void;
    params: Record<string, any>;
    page?: string;
    locationSwitchInProgress?: boolean;
    children?: ReactNode;
};
