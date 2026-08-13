import { statusTypes as eventStatuses } from '../../../../events/statusTypes';

type Input = {
    hasWriteAccess: boolean,
    eventStatus?: string,
    canUncompleteEvent: boolean,
    canEditExpiredEvent: boolean,
};

export const canChangeCompletionStatus = ({
    hasWriteAccess,
    eventStatus,
    canUncompleteEvent,
    canEditExpiredEvent,
}: Input): boolean => {
    if (!hasWriteAccess) return false;
    if (eventStatus === eventStatuses.COMPLETED) {
        return canUncompleteEvent && canEditExpiredEvent;
    }
    return eventStatus === eventStatuses.ACTIVE;
};
