import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { type ProgramStage } from '../../metaData';

export type Props = {
    eventId: string;
    eventStatus?: string;
    occurredAt?: string;
    completedAt?: string;
    programId: string;
    programStage?: ProgramStage | null;
    pendingApiResponse?: boolean;

    /** Optional pre-delete snapshot; only needed when the caller wants delete-rollback. */
    eventDetailsForRollback?: ApiEnrollmentEvent;

    onCompletionStatusMutate?: (newStatus: string) => void;
    onCompletionStatusUpdated?: (newStatus: string) => void;
    onCompletionStatusError?: () => void;

    onStatusMutate?: (eventId: string, newStatus: string) => void;
    onStatusError?: (eventId: string, previousStatus: string) => void;
    onStatusUpdated?: (eventId: string, newStatus: string) => void;

    onOptimisticDelete?: (eventId: string) => void;
    onDeleteSuccess?: (eventId: string) => void;
    onDeleteError?: (event: ApiEnrollmentEvent) => void;

    onOpenChangelog?: () => void;

    dataTest?: string;
};
