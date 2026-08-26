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
    scheduledAtClient?: string,
};

type Output = {
    isEventExpired: boolean,
    isEventBlockedByExpiry: boolean,
    isEventBlockedByCompletion: boolean,
    isEventBlockedByUncompleteAuthority: boolean,
    isEventReadOnly: boolean,
    hasStageWriteAccess: boolean,
    canToggleCompletion: boolean,
    canEditProgramStage: boolean,
};

const computeExpiryBlocked = (
    isWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
    hasEditExpiredAuthority: boolean,
): boolean => (!isWithinValidPeriod || !isWithinCompleteExpiry) && !hasEditExpiredAuthority;

const computeIsEventReadOnly = (
    canEditProgramStage: boolean,
    isEventBlockedByExpiry: boolean,
    isCompletedAndBlockingForm: boolean,
    eventStatus?: string,
): boolean =>
    !canEditProgramStage
    || isEventBlockedByExpiry
    || isCompletedAndBlockingForm
    || eventStatus === eventStatuses.SKIPPED;

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
    scheduledAtClient,
}: Input): Output => {
    const eventAccess = getProgramEventAccess(programId, stage?.id ?? null);
    const expiryPeriod = useProgramExpiryForUser(programId);
    const completeEventsExpiryDays = useCompleteEventsExpiryForUser(programId);
    const { hasAuthority: hasUncompleteAuthority } = useAuthority(Authorities.UNCOMPLETE_EVENT);
    const { hasAuthority: hasEditExpiredAuthority } = useAuthority(Authorities.EDIT_EXPIRED);
    // For events that haven't occurred yet (SCHEDULE, OVERDUE) the expiry check falls back to
    // scheduledAt so the frontend blocks the same actions the backend would reject.
    const expiryReferenceDate = occurredAtClient || scheduledAtClient;
    const { isWithinValidPeriod } = isValidPeriod(expiryReferenceDate ?? '', expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);

    const canEditProgramStage = !!eventAccess?.write;
    const isEventExpired = !isWithinValidPeriod || !isWithinCompleteExpiry;
    const isEventBlockedByExpiry = computeExpiryBlocked(
        isWithinValidPeriod, isWithinCompleteExpiry, hasEditExpiredAuthority,
    );
    const isCompletedAndBlockingForm = !!(stage?.blockEntryForm && eventStatus === eventStatuses.COMPLETED);

    const canToggleCompletion = computeCanToggleCompletion(
        canEditProgramStage, isEventBlockedByExpiry, hasUncompleteAuthority, eventStatus,
    );

    const isEventBlockedByCompletion = isCompletedAndBlockingForm && !canToggleCompletion;
    const isEventBlockedByUncompleteAuthority =
        eventStatus === eventStatuses.COMPLETED && !canToggleCompletion;

    const hasStageWriteAccess = canEditProgramStage && !isEventBlockedByExpiry;
    const isEventReadOnly = computeIsEventReadOnly(
        canEditProgramStage, isEventBlockedByExpiry, isCompletedAndBlockingForm, eventStatus,
    );

    return {
        isEventExpired,
        isEventBlockedByExpiry,
        isEventBlockedByCompletion,
        isEventBlockedByUncompleteAuthority,
        isEventReadOnly,
        hasStageWriteAccess,
        canToggleCompletion,
        canEditProgramStage,
    };
};
