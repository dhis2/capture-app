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
    canUncompleteEvent: boolean,
    expiryPeriod: ReturnType<typeof useProgramExpiryForUser>,
    readOnly: boolean,
};

// An event is read-only when ANY of the following is true:
//   - No write access to the program stage (eventAccess.write is false).
//   - occurredAt is outside the program's expiry period (overridden by F_EDIT_EXPIRED).
//   - The event is completed and past the completeEventsExpiryDays window (overridden by F_EDIT_EXPIRED).
//   - The event is completed on a stage with blockEntryForm set (overridden by F_EDIT_EXPIRED).


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
    const { hasAuthority: canEditExpired } = useAuthorities({ authorities: ['F_EDIT_EXPIRED'] });

    const { isWithinValidPeriod: isEventWithinValidPeriod } = isValidPeriod(occurredAtClient ?? '', expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);

    const canEditCompletedEvent = canEditExpired || !(
        stage?.blockEntryForm
        && eventStatus === eventStatuses.COMPLETED
    );

    const readOnly = !eventAccess?.write
        || !isEventWithinValidPeriod
        || !isWithinCompleteExpiry
        || !canEditCompletedEvent;

    return {
        eventAccess,
        isEventWithinValidPeriod,
        isWithinCompleteExpiry,
        canEditCompletedEvent,
        canUncompleteEvent,
        expiryPeriod,
        readOnly,
    };
};
