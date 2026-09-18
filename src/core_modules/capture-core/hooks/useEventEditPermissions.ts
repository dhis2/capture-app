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

const checkWithinValidPeriod = (
    referenceDate: string | undefined,
    expiryPeriod: any,
): boolean =>
    (referenceDate ? isValidPeriod(referenceDate, expiryPeriod).isWithinValidPeriod : true);

const computeExpiryBlocked = (
    isWithinValidPeriod: boolean,
    isWithinCompleteExpiry: boolean,
    hasEditExpiredAuthority: boolean,
): boolean => (!isWithinValidPeriod || !isWithinCompleteExpiry) && !hasEditExpiredAuthority;

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

export const useEventEditPermissions = ({
    programId,
    stage,
    eventStatus,
    occurredAtClient,
    completedAtClient,
    scheduledAtClient,
}: Input) => {
    // Expiry
    const expiryPeriod = useProgramExpiryForUser(programId);
    const completeEventsExpiryDays = useCompleteEventsExpiryForUser(programId);
    const { hasAuthority: hasEditExpiredAuthority } = useAuthority(Authorities.EDIT_EXPIRED);
    const expiryReferenceDate = occurredAtClient || scheduledAtClient;
    const isWithinValidPeriod = checkWithinValidPeriod(expiryReferenceDate, expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);
    const isEventBlockedByExpiry = computeExpiryBlocked(
        isWithinValidPeriod, isWithinCompleteExpiry, hasEditExpiredAuthority,
    );

    // Program stage Access
    const stageAccess = getProgramEventAccess(programId, stage?.id ?? null);
    const canEditProgramStage = !!stageAccess?.write;

    // Status
    const isEventCompleted = eventStatus === eventStatuses.COMPLETED;
    const isEventOverdueOrScheduled =
        eventStatus === eventStatuses.OVERDUE || eventStatus === eventStatuses.SCHEDULE;
    const isCompletedAndBlockingForm = !!(stage?.blockEntryForm && isEventCompleted);

    // Completion
    const { hasAuthority: hasUncompleteAuthority } = useAuthority(Authorities.UNCOMPLETE_EVENT);
    const canToggleCompletion = computeCanToggleCompletion(
        canEditProgramStage, isEventBlockedByExpiry, hasUncompleteAuthority, eventStatus,
    );
    const isEventBlockedByCompletion = isCompletedAndBlockingForm && !hasUncompleteAuthority;

    // Overall
    const isEventReadOnly = computeIsEventReadOnly(
        canEditProgramStage, isEventBlockedByExpiry, isCompletedAndBlockingForm, eventStatus,
    );

    return {
        // Program stage Access
        canEditProgramStage,
        // Expiry
        isEventBlockedByExpiry,
        // Completion
        canToggleCompletion,
        isEventBlockedByCompletion,
        // Status
        isEventCompleted,
        isEventOverdueOrScheduled,
        // Overall
        isEventReadOnly,
    };
};
