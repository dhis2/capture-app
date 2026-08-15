import { statusTypes as eventStatuses } from '../events/statusTypes';

export const computeCanUncompleteEvent = ({
    hasWriteAccess,
    eventStatus,
    isExpired,
    hasEditExpiredAuthority,
    hasUncompleteAuthority,
}: {
    hasWriteAccess: boolean,
    eventStatus: string | undefined,
    isExpired: boolean,
    hasEditExpiredAuthority: boolean,
    hasUncompleteAuthority: boolean,
}): boolean => {
    if (!hasWriteAccess) return false;
    if (eventStatus === eventStatuses.COMPLETED) {
        if (isExpired && !hasEditExpiredAuthority) return false;
        return hasUncompleteAuthority;
    }
    return eventStatus === eventStatuses.ACTIVE;
};
