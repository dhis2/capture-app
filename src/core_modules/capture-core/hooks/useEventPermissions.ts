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

// Single source of truth for what a user may do with an event. Consumers should read these flags
// rather than re-deriving rules from `eventStatus` / `eventAccess`:
//   - `eventAccess`: the user's read/write access to the program stage.
//   - `isEventWithinValidPeriod`: whether occurredAt still falls inside the program's expiry period.
//   - `isWithinCompleteExpiry`: whether a completed event is still inside the
//     completeEventsExpiryDays window.
//   - `canEditCompletedEvent`: false only when a completed event sits on a stage with
//     blockEntryForm; F_EDIT_EXPIRED overrides it.
//   - `canUncompleteEvent`: whether the user holds F_UNCOMPLETE_EVENT.
//   - `expiryPeriod`: the program's expiry period, for consumers that validate dates themselves.
//   - `readOnly`: blocks the data entry form - no write access, or any of the expiry rules above
//     fails. Side actions (notes, relationships, assignee, delete) stay available on a read-only
//     event.
//   - `canEditEvent`: shows the edit-event button. Not read-only, and not skipped - a skipped event
//     is unskipped rather than edited in place.
//   - `canCompleteEvent`: an ACTIVE event can be completed; reopening a COMPLETED one needs
//     F_UNCOMPLETE_EVENT.
//   - `canSkipEvent`: only scheduled events can be skipped, and only skipped ones unskipped.
//   - `canDeleteEvent`: write access alone, deliberately not gated on `readOnly` - an expired or
//     completed event still offers Delete, disabled with a tooltip explaining why, so consumers
//     combine this with `readOnly` for the disabled state.

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
