import type { Observable } from 'rxjs';
import type { Action } from 'redux';

export type ReduxStore = {
    value: {
        dataEntries: Record<string, { eventId: string }>;
        currentSelections: Record<string, unknown>;
        possibleDuplicates: {
            isLoading: boolean;
            isUpdating: boolean;
            loadError: boolean;
            teis: any[];
            currentPage?: number;
        };
        newPage?: {
            uid?: string;
        };
        enrollmentPage?: {
            teiId?: string;
            programId?: string;
            enrollmentId?: string;
            fetchStatus?: Record<string, unknown>;
            enrollments?: any[];
            pageOpen?: boolean;
        };
        enrollmentDomain?: {
            enrollment?: {
                events?: any[];
            };
            eventSaveInProgress?: {
                linkMode?: string;
                requestEventId?: string;
                linkedEventId?: string;
                linkedOrgUnitId?: string;
            };
        };
    };
};

export type ApiUtils = {
    querySingleResource: (params: { resource: string; params?: Record<string, unknown> }) => Promise<any>;
    fromClientDate: (date: string) => { getServerZonedISOString: () => string };
    navigate: (url: string) => void;
};

/**
 * Represents an Observable stream of Redux actions with a specific payload type and optional meta.
 *
 * @template PayloadType The type of the action's payload.
 * @template MetaType The type of the action's meta.
 */
export type EpicAction<PayloadType, MetaType = Record<string, unknown>> = Observable<Action & { payload: PayloadType, meta: MetaType }>;
