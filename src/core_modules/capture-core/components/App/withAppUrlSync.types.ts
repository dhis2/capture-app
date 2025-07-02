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
            showEditEvent?: boolean;
            loading?: boolean;
        };
        loadError?: string;
        eventHasChanged?: boolean;
        saveInProgress?: boolean;
        notesSection?: {
            isLoading?: boolean;
            fieldValue?: string;
        };
        relationshipsSection?: {
            isLoading?: boolean;
        };
        showAddRelationship?: boolean;
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
        selectionsError?: {
            error?: string;
        };
    };
    dataEntries: Record<string, {
        itemId?: string;
        eventId?: string;
    }>;
    events: Record<string, any>;
    formsValues: Record<string, any>;
    dataEntriesFieldsValue: Record<string, any>;
    dataEntriesFieldsMeta: Record<string, any>;
    dataEntriesFieldsUI: Record<string, any>;
    dataEntriesUI: Record<string, {
        saveAttempted?: boolean;
        finalInProgress?: boolean;
    }>;
    dataEntriesNotes: Record<string, any[]>;
    dataEntriesRelationships: Record<string, any[]>;
    dataEntriesInProgressList: Record<string, any[]>;
    notes: {
        viewEvent?: any[];
    };
    relationships: {
        viewEvent?: any[];
    };
    newEventPage: {
        recentlyAddedRelationshipId?: string;
        formHorizontal?: boolean;
        showAddRelationship?: boolean;
        saveTypes?: any;
    };
    teiSearch: Record<string, {
        searchResults?: {
            formId?: string;
            searchGroupId?: string;
            resultsLoading?: boolean;
        };
    }>;
    rulesEffectsIndicators: Record<string, any>;
    rulesEffectsFeedback: Record<string, any>;
    rulesEffectsGeneralWarnings: Record<string, any>;
    rulesEffectsGeneralErrors: Record<string, any>;
    recentlyAddedEvents: Record<string, any>;
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
