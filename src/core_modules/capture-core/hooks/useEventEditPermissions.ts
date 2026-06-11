import { useProgramExpiryForUser } from './useProgramExpiryForUser';
import { useCompleteEventsExpiryForUser } from './useCompleteEventsExpiryForUser';
import { getProgramEventAccess, ProgramStage } from '../metaData';
import { isValidPeriod, isWithinCompleteEventsExpiry } from '../utils/validation/validators/form';
import { eventStatuses } from '../components/WidgetEventEdit/constants/status.const';
import { useAuthorities } from '../utils/authority/useAuthorities';

type Input = {
    programId: string,
    stage?: ProgramStage | null,
    eventStatus?: string,
    occurredAtClient?: string,
    completedAtClient?: string,
};

type Output = {
    eventAccess: { read: boolean, write: boolean } | null,
    isEventWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
    canEditCompletedEvent: boolean,
    readOnly: boolean,
};

// An event is read-only when ANY of the following is true:
//   - eventAccess.write is false: user lacks write access to the program (stage)
//   - !isEventWithinValidPeriod: occurredAt falls outside the program's expiry period
//     (overridden by F_EDIT_EXPIRED via useProgramExpiryForUser)
//   - !isWithinCompleteExpiry: event was completed and the completeEventsExpiryDays window has passed
//     (overridden by F_EDIT_EXPIRED via useCompleteEventsExpiryForUser)
//   - !canEditCompletedEvent: stage.blockEntryForm is set AND event status is COMPLETED AND the user
//     lacks F_UNCOMPLETE_EVENT. Users with that authority can edit a completed, block-entry event.

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

    const { isWithinValidPeriod: isEventWithinValidPeriod } = isValidPeriod(occurredAtClient ?? '', expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);

    const canEditCompletedEvent = !(
        stage?.blockEntryForm
        && !canUncompleteEvent
        && eventStatus === eventStatuses.COMPLETED
    );

    const readOnly = !eventAccess?.write
        || !isEventWithinValidPeriod
        || !canEditCompletedEvent
        || !isWithinCompleteExpiry;

    return {
        eventAccess,
        isEventWithinValidPeriod,
        isWithinCompleteExpiry,
        canEditCompletedEvent,
        readOnly,
    };
};
