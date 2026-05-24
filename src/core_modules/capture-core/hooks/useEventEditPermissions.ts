import { useProgramExpiryForUser } from './useProgramExpiryForUser';
import { useCompleteEventsExpiryForUser } from './useCompleteEventsExpiryForUser';
import { dataElementTypes, getProgramEventAccess, ProgramStage } from '../metaData';
import { convertFormToClient } from '../converters';
import { isValidPeriod, isWithinCompleteEventsExpiry } from '../utils/validation/validators/form';
import { eventStatuses } from '../components/WidgetEventEdit/constants/status.const';

type Input = {
    programId: string,
    stage: ProgramStage,
    eventStatus?: string,
    occurredAt?: string,
    completedAt?: string,
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
//   - !canEditCompletedEvent: stage.blockEntryForm is set AND event status is COMPLETED.
//     To edit, the user must first uncomplete the event (separate action gated by F_UNCOMPLETE_EVENT).

export const useEventEditPermissions = ({
    programId,
    stage,
    eventStatus,
    occurredAt,
    completedAt,
}: Input): Output => {
    const eventAccess = getProgramEventAccess(programId, stage.id);
    const expiryPeriod = useProgramExpiryForUser(programId);
    const completeEventsExpiryDays = useCompleteEventsExpiryForUser(programId);

    const occurredAtClient = convertFormToClient(occurredAt, dataElementTypes.DATE) as string;
    const { isWithinValidPeriod: isEventWithinValidPeriod } = isValidPeriod(occurredAtClient, expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAt, completeEventsExpiryDays);

    const canEditCompletedEvent = !(stage.blockEntryForm && eventStatus === eventStatuses.COMPLETED);

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
