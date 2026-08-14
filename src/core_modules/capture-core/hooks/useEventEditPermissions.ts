import { useProgramExpiryForUser } from './useProgramExpiryForUser';
import { useCompleteEventsExpiryForUser } from './useCompleteEventsExpiryForUser';
import { getProgramEventAccess, type ProgramStage } from '../metaData';
import {
    isValidPeriod,
    isWithinCompleteEventsExpiry,
    canChangeCompletionStatus as computeCanChangeCompletionStatus,
} from '../utils/validation/validators/form';
import { statusTypes as eventStatuses } from '../events/statusTypes';
import { useAuthority } from '../utils/authority/useAuthority';
import { Authorities } from '../utils/authority/authorities';

type Input = {
    programId: string,
    stage?: ProgramStage | null,
    eventStatus?: string,
    occurredAtClient?: string,
    completedAtClient?: string,
};

type Output = {
    isEventBlockedByExpiry: boolean,
    isFormBlockedByCompletion: boolean,
    canEditCompletionStatus: boolean,
    canEditEvent: boolean,
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
    const { hasAuthority: canUncompleteEvent } = useAuthority(Authorities.UNCOMPLETE_EVENT);
    const { hasAuthority: hasEditExpiredAuthority } = useAuthority(Authorities.EDIT_EXPIRED);
    const { isWithinValidPeriod } = isValidPeriod(occurredAtClient ?? '', expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);
    const isExpired = !isWithinValidPeriod || !isWithinCompleteExpiry;

    const isFormBlockedByCompletion = !!(stage?.blockEntryForm && eventStatus === eventStatuses.COMPLETED);
    const isEventBlockedByExpiry = isExpired && !hasEditExpiredAuthority;

    const canEditCompletionStatus = computeCanChangeCompletionStatus({
        hasWriteAccess: !!eventAccess?.write,
        eventStatus,
        canUncompleteEvent,
        isExpired,
        hasEditExpiredAuthority,
    });

    const canEditEvent = !!eventAccess?.write
        && !isEventBlockedByExpiry
        && !isFormBlockedByCompletion;

    return {
        isEventBlockedByExpiry,
        isFormBlockedByCompletion,
        canEditCompletionStatus,
        canEditEvent,
    };
};
