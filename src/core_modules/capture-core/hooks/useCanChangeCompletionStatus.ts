import { getProgramEventAccess, type ProgramStage } from '../metaData';
import { useProgramExpiryForUser } from './useProgramExpiryForUser';
import { useCompleteEventsExpiryForUser } from './useCompleteEventsExpiryForUser';
import {
    isValidPeriod,
    isWithinCompleteEventsExpiry,
} from '../utils/validation/validators/form';
import { useAuthority, Authorities } from '../utils/authority';
import { computeCanUncompleteEvent } from './computeCanUncompleteEvent';

type Input = {
    programId: string;
    stage?: ProgramStage | null;
    eventStatus?: string;
    occurredAtClient?: string;
    completedAtClient?: string;
};

export const useCanChangeCompletionStatus = ({
    programId,
    stage,
    eventStatus,
    occurredAtClient,
    completedAtClient,
}: Input): boolean => {
    const eventAccess = getProgramEventAccess(programId, stage?.id ?? null);
    const expiryPeriod = useProgramExpiryForUser(programId);
    const completeEventsExpiryDays = useCompleteEventsExpiryForUser(programId);
    const { hasAuthority: hasUncompleteAuthority } = useAuthority(Authorities.UNCOMPLETE_EVENT);
    const { hasAuthority: hasEditExpiredAuthority } = useAuthority(Authorities.EDIT_EXPIRED);
    const { isWithinValidPeriod } = isValidPeriod(occurredAtClient ?? '', expiryPeriod ?? null);
    const isWithinCompleteExpiry = isWithinCompleteEventsExpiry(completedAtClient, completeEventsExpiryDays);
    const isExpired = !isWithinValidPeriod || !isWithinCompleteExpiry;

    return computeCanUncompleteEvent({
        hasWriteAccess: !!eventAccess?.write,
        eventStatus,
        isExpired,
        hasEditExpiredAuthority,
        hasUncompleteAuthority,
    });
};
