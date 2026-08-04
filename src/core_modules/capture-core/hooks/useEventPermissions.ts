import { useProgramExpiryForUser } from './useProgramExpiryForUser';
import { useCompleteEventsExpiryForUser } from './useCompleteEventsExpiryForUser';
import { getProgramEventAccess, ProgramStage } from '../metaData';
import { isValidPeriod, isWithinCompleteEventsExpiry } from '../utils/validation/validators/form';
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
    eventAccess: { read: boolean, write: boolean } | null,
    isEventWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
    canEditCompletedEvent: boolean,
    canUncompleteEvent: boolean,
    expiryPeriod: ReturnType<typeof useProgramExpiryForUser>,
    readOnly: boolean,
    canEditEvent: boolean,
    canCompleteEvent: boolean,
    canSkipEvent: boolean,
    canDeleteEvent: boolean,
};

const getCanEditCompletedEvent = (
    stage: ProgramStage | null | undefined,
    eventStatus: string | undefined,
    canEditExpired: boolean,
) =>
    canEditExpired || !(stage?.blockEntryForm && eventStatus === eventStatuses.COMPLETED);

const getReadOnly = ({ hasWriteAccess, isEventWithinValidPeriod, isWithinCompleteExpiry, canEditCompletedEvent }: {
    hasWriteAccess: boolean,
    isEventWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
    canEditCompletedEvent: boolean,
}) =>
    !hasWriteAccess
    || !isEventWithinValidPeriod
    || !isWithinCompleteExpiry
    || !canEditCompletedEvent;

const getCanCompleteEvent = (eventStatus?: string, canUncompleteEvent?: boolean) => {
    if (eventStatus === eventStatuses.COMPLETED) {
        return !!canUncompleteEvent;
    }
    return eventStatus === eventStatuses.ACTIVE;
};

const getCanSkipEvent = (eventStatus?: string) =>
    eventStatus === eventStatuses.SCHEDULE || eventStatus === eventStatuses.SKIPPED;

export const useEventPermissions = ({
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

    const hasWriteAccess = !!eventAccess?.write;
    const canEditCompletedEvent = getCanEditCompletedEvent(stage, eventStatus, canEditExpired);
    const readOnly = getReadOnly({
        hasWriteAccess,
        isEventWithinValidPeriod,
        isWithinCompleteExpiry,
        canEditCompletedEvent,
    });

    return {
        eventAccess,
        isEventWithinValidPeriod,
        isWithinCompleteExpiry,
        canEditCompletedEvent,
        canUncompleteEvent,
        expiryPeriod,
        readOnly,
        canEditEvent: !readOnly && eventStatus !== eventStatuses.SKIPPED,
        canCompleteEvent: hasWriteAccess && getCanCompleteEvent(eventStatus, canUncompleteEvent),
        canSkipEvent: hasWriteAccess && getCanSkipEvent(eventStatus),
        canDeleteEvent: hasWriteAccess,
    };
};
