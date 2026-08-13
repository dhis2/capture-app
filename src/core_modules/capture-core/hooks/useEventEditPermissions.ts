import { useProgramExpiryForUser } from './useProgramExpiryForUser';
import { useCompleteEventsExpiryForUser } from './useCompleteEventsExpiryForUser';
import { getProgramEventAccess, type ProgramStage } from '../metaData';
import {
    isValidPeriod,
    isWithinCompleteEventsExpiry,
    canChangeCompletionStatus as computeCanChangeCompletionStatus,
    canEditExpiredEvent as computeCanEditExpiredEvent,
} from '../utils/validation/validators/form';
import { statusTypes as eventStatuses } from '../events/statusTypes';
import { useAuthorities } from '../utils/authority/useAuthorities';

type Input = {
    programId: string,
    stage?: ProgramStage | null,
    eventStatus?: string,
    occurredAtClient?: string,
    completedAtClient?: string,
};

type Output = {
    canEditExpiredEvent: boolean,
    canEditCompletedEvent: boolean,
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
    const { hasAuthority: canUncompleteEvent } = useAuthorities({ authorities: ['F_UNCOMPLETE_EVENT'] });
    const { hasAuthority: hasEditExpiredAuthority } = useAuthorities({ authorities: ['F_EDIT_EXPIRED'] });
    const { isWithinValidPeriod: isEventWithinValidPeriod } = isValidPeriod(occurredAtClient ?? '', expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);

    const canEditCompletedEvent = !(
        stage?.blockEntryForm
        && eventStatus === eventStatuses.COMPLETED
    );

    const canEditExpiredEvent = computeCanEditExpiredEvent({
        hasEditExpiredAuthority,
        isEventWithinValidPeriod,
        isWithinCompleteExpiry,
    });

    const canEditCompletionStatus = computeCanChangeCompletionStatus({
        hasWriteAccess: !!eventAccess?.write,
        eventStatus,
        canUncompleteEvent,
        canEditExpiredEvent,
    });

    const canEditEvent = !!eventAccess?.write
        && canEditExpiredEvent
        && canEditCompletedEvent;

    return {
        canEditExpiredEvent,
        canEditCompletedEvent,
        canEditCompletionStatus,
        canEditEvent,
    };
};
