import { useProgramExpiryForUser } from './useProgramExpiryForUser';
import { useCompleteEventsExpiryForUser } from './useCompleteEventsExpiryForUser';
import { getProgramEventAccess, type ProgramStage } from '../metaData';
import {
    isValidPeriod,
    isWithinCompleteEventsExpiry,
} from '../utils/validation/validators/form';
import { statusTypes as eventStatuses } from '../events/statusTypes';
import { useAuthority, Authorities } from '../utils/authority';

type Input = {
    programId: string,
    stage?: ProgramStage | null,
    eventStatus?: string,
    occurredAtClient?: string,
    completedAtClient?: string,
};

type Output = {
    isEventBlockedByExpiry: boolean,
    isEventBlockedByCompletion: boolean,
    isEventReadOnly: boolean,
    isEventDeletable: boolean,
};

const computeExpiryBlocked = (
    isWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
    hasEditExpiredAuthority: boolean,
): boolean => (!isWithinValidPeriod || !isWithinCompleteExpiry) && !hasEditExpiredAuthority;

const computeEditAccess = (
    hasWriteAccess: boolean,
    isEventBlockedByExpiry: boolean,
    isCompletedAndBlockingForm: boolean,
    eventStatus?: string,
) => ({
    isEventReadOnly: !hasWriteAccess
        || isEventBlockedByExpiry
        || isCompletedAndBlockingForm
        || eventStatus === eventStatuses.SKIPPED,
    isEventDeletable: hasWriteAccess && !isEventBlockedByExpiry && !isCompletedAndBlockingForm,
});

const canUncompletEvent = (
    hasWriteAccess: boolean,
    eventStatus: string | undefined,
    hasUncompleteAuthority: boolean,
    isEventBlockedByExpiry: boolean,
): boolean => {
    if (!hasWriteAccess) return false;
    if (eventStatus === eventStatuses.COMPLETED) {
        if (isEventBlockedByExpiry) return false;
        return hasUncompleteAuthority;
    }
    return eventStatus === eventStatuses.ACTIVE;
};

export const useEventEditPermissions = ({
    programId,
    stage,
    eventStatus,
    occurredAtClient,
    completedAtClient,
}: Input): Output => {
    const eventAccess = getProgramEventAccess(programId, stage?.id ?? null);
    const expiryPeriod = useProgramExpiryForUser(programId);
    const completeEventsExpiryDays = useCompleteEventsExpiryForUser(programId);
    const { hasAuthority: hasUncompleteAuthority } = useAuthority(Authorities.UNCOMPLETE_EVENT);
    const { hasAuthority: hasEditExpiredAuthority } = useAuthority(Authorities.EDIT_EXPIRED);
    const { isWithinValidPeriod } = isValidPeriod(occurredAtClient ?? '', expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);
    const isCompletedAndBlockingForm = !!(stage?.blockEntryForm && eventStatus === eventStatuses.COMPLETED);
    const isEventBlockedByExpiry = computeExpiryBlocked(
        isWithinValidPeriod, isWithinCompleteExpiry, hasEditExpiredAuthority,
    );

    const canUncompleteEvent = canUncompletEvent(
        !!eventAccess?.write,
        eventStatus,
        hasUncompleteAuthority,
        isEventBlockedByExpiry,
    );

    const isEventBlockedByCompletion = eventStatus === eventStatuses.COMPLETED && !canUncompleteEvent;

    const { isEventReadOnly, isEventDeletable } = computeEditAccess(
        !!eventAccess?.write,
        isEventBlockedByExpiry,
        isCompletedAndBlockingForm,
        eventStatus,
    );

    return {
        isEventBlockedByExpiry,
        isEventBlockedByCompletion,
        isEventReadOnly,
        isEventDeletable,
    };
};
