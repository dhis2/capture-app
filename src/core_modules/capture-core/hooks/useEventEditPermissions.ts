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
    isEventExpired: boolean,
    isEventBlockedByExpiry: boolean,
    isCompletedAndBlockingForm: boolean,
    isEventBlockedByCompletion: boolean,
    isEventReadOnly: boolean,
    canDeleteEvent: boolean,
    canToggleCompletion: boolean,
    canEditProgramStage: boolean,
};

const computeExpiryBlocked = (
    isWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
    hasEditExpiredAuthority: boolean,
): boolean => (!isWithinValidPeriod || !isWithinCompleteExpiry) && !hasEditExpiredAuthority;

const computeEditAccess = (
    canEditProgramStage: boolean,
    isEventBlockedByExpiry: boolean,
    isCompletedAndBlockingForm: boolean,
    eventStatus?: string,
) => ({
    isEventReadOnly: !canEditProgramStage
        || isEventBlockedByExpiry
        || isCompletedAndBlockingForm
        || eventStatus === eventStatuses.SKIPPED,
    canDeleteEvent: canEditProgramStage && !isEventBlockedByExpiry && !isCompletedAndBlockingForm,
});

const computeCanToggleCompletion = (
    canEditProgramStage: boolean,
    isEventBlockedByExpiry: boolean,
    hasUncompleteAuthority: boolean,
    eventStatus?: string,
): boolean =>
    canEditProgramStage
    && !isEventBlockedByExpiry
    && (
        eventStatus === eventStatuses.ACTIVE
        || (eventStatus === eventStatuses.COMPLETED && hasUncompleteAuthority)
    );

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
    const canEditProgramStage = !!eventAccess?.write;
    const isCompletedAndBlockingForm = !!(stage?.blockEntryForm && eventStatus === eventStatuses.COMPLETED);
    const isEventExpired = !isWithinValidPeriod || !isWithinCompleteExpiry;
    const isEventBlockedByExpiry = computeExpiryBlocked(
        isWithinValidPeriod, isWithinCompleteExpiry, hasEditExpiredAuthority,
    );

    const canToggleCompletion = computeCanToggleCompletion(
        canEditProgramStage, isEventBlockedByExpiry, hasUncompleteAuthority, eventStatus,
    );

    const isEventBlockedByCompletion = isCompletedAndBlockingForm && !canToggleCompletion;

    const { isEventReadOnly, canDeleteEvent } = computeEditAccess(
        canEditProgramStage,
        isEventBlockedByExpiry,
        isCompletedAndBlockingForm,
        eventStatus,
    );

    return {
        isEventExpired,
        isEventBlockedByExpiry,
        isCompletedAndBlockingForm,
        isEventBlockedByCompletion,
        isEventReadOnly,
        canDeleteEvent,
        canToggleCompletion,
        canEditProgramStage,
    };
};
