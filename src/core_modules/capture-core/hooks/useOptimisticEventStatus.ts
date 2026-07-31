import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import {
    updateEnrollmentEvent,
    commitEnrollmentEvent,
    rollbackEnrollmentEvent,
} from '../components/Pages/common/EnrollmentOverviewDomain';

type Options = {
    onCompletionSuccess?: () => void;
    onStatusSuccess?: () => void;
};

// Shared optimistic-update handlers for the enrollmentDomain event slice. Used by any tracker widget
// that lets the user change an event's completion or non-completion status through the overflow menu.
//
// Completion trio strips `completedAt`/`completedBy` so the optimistic state doesn't carry
// stale values into the "still in-flight" render window.
// Status trio (skip / unskip) keeps the whole event body since the transition doesn't touch completion.
export const useOptimisticEventStatus = (
    event: ApiEnrollmentEvent | undefined,
    eventId: string,
    options?: Options,
) => {
    const dispatch = useDispatch();
    const { onCompletionSuccess, onStatusSuccess } = options ?? {};

    const onCompletionStatusMutate = useCallback((newStatus: string) => {
        if (!event) return;
        const { completedAt, completedBy, ...rest } = event;
        dispatch(updateEnrollmentEvent(eventId, { ...rest, status: newStatus }));
    }, [dispatch, event, eventId]);

    const onCompletionStatusUpdated = useCallback(() => {
        dispatch(commitEnrollmentEvent(eventId));
        onCompletionSuccess?.();
    }, [dispatch, eventId, onCompletionSuccess]);

    const onCompletionStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(eventId));
    }, [dispatch, eventId]);

    const onStatusMutate = useCallback((_id: string, newStatus: string) => {
        if (!event) return;
        dispatch(updateEnrollmentEvent(eventId, { ...event, status: newStatus }));
    }, [dispatch, event, eventId]);

    const onStatusUpdated = useCallback(() => {
        dispatch(commitEnrollmentEvent(eventId));
        onStatusSuccess?.();
    }, [dispatch, eventId, onStatusSuccess]);

    const onStatusError = useCallback(() => {
        dispatch(rollbackEnrollmentEvent(eventId));
    }, [dispatch, eventId]);

    return {
        onCompletionStatusMutate,
        onCompletionStatusUpdated,
        onCompletionStatusError,
        onStatusMutate,
        onStatusUpdated,
        onStatusError,
    };
};
