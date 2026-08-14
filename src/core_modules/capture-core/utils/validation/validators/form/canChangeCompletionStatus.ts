import { statusTypes as eventStatuses } from '../../../../events/statusTypes';

type Input = {
    hasWriteAccess: boolean,
    eventStatus?: string,
    canUncompleteEvent: boolean,
    isExpired: boolean,
    hasEditExpiredAuthority: boolean,
};

export const canChangeCompletionStatus = ({
    hasWriteAccess,
    eventStatus,
    canUncompleteEvent,
    isExpired,
    hasEditExpiredAuthority,
}: Input): boolean => {
    if (!hasWriteAccess) return false;
    if (eventStatus === eventStatuses.COMPLETED) {
        if (isExpired && !hasEditExpiredAuthority) return false;
        return canUncompleteEvent;
    }
    return eventStatus === eventStatuses.ACTIVE;
};
