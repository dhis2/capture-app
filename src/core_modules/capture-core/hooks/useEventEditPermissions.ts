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
    canUncompleteEvent: boolean,
};

const canUncompletEvent = (
    hasWriteAccess: boolean,
    eventStatus: string | undefined,
    isExpired: boolean,
    hasEditExpiredAuthority: boolean,
    hasUncompleteAuthority: boolean,
): boolean => {
    if (!hasWriteAccess) return false;
    if (eventStatus === eventStatuses.COMPLETED) {
        if (isExpired && !hasEditExpiredAuthority) return false;
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
    const isExpired = !isWithinValidPeriod || !isWithinCompleteExpiry;

    const isCompletedAndBlockingForm = !!(stage?.blockEntryForm && eventStatus === eventStatuses.COMPLETED);
    const isEventBlockedByExpiry = isExpired && !hasEditExpiredAuthority;

    const canUncompleteEvent = canUncompletEvent(
        !!eventAccess?.write,
        eventStatus,
        isExpired,
        hasEditExpiredAuthority,
        hasUncompleteAuthority,
    );

    const isEventBlockedByCompletion = isCompletedAndBlockingForm && !canUncompleteEvent;

    const isEventReadOnly = !eventAccess?.write
        || isEventBlockedByExpiry
        || isCompletedAndBlockingForm;

    return {
        isEventBlockedByExpiry,
        isEventBlockedByCompletion,
        isEventReadOnly,
        canUncompleteEvent,
    };
};
