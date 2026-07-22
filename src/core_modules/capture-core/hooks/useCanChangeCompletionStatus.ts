import { useAuthorities } from '../utils/authority/useAuthorities';
import { eventStatuses } from '../components/WidgetEventEdit/constants/status.const';

type Input = {
    eventStatus?: string,
    eventAccess: { read: boolean, write: boolean } | null,
};

export const useCanChangeCompletionStatus = ({ eventStatus, eventAccess }: Input): boolean => {
    const { hasAuthority: canUncompleteEvent } = useAuthorities({ authorities: ['F_UNCOMPLETE_EVENT'] });

    if (!eventAccess?.write) {
        return false;
    }
    if (eventStatus === eventStatuses.COMPLETED) {
        return canUncompleteEvent;
    }
    return eventStatus === eventStatuses.ACTIVE;
};
