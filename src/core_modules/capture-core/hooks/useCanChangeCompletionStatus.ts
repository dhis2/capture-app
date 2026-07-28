import { useAuthorities } from '../utils/authority/useAuthorities';
import { getProgramEventAccess, ProgramStage } from '../metaData';
import { eventStatuses } from '../components/WidgetEventEdit/constants/status.const';

type Input = {
    programId: string,
    stage?: ProgramStage | null,
    eventStatus?: string,
};

// canChangeCompletionStatus is true when ALL of the following hold:
//   - Write access to the program stage (eventAccess.write is true).
//   - Event status is ACTIVE, OR status is COMPLETED and the user has F_UNCOMPLETE_EVENT.

export const useCanChangeCompletionStatus = ({ programId, stage, eventStatus }: Input): boolean => {
    const { hasAuthority: canUncompleteEvent } = useAuthorities({ authorities: ['F_UNCOMPLETE_EVENT'] });
    const eventAccess = getProgramEventAccess(programId, stage?.id ?? null);

    if (!eventAccess?.write) {
        return false;
    }
    if (eventStatus === eventStatuses.COMPLETED) {
        return canUncompleteEvent;
    }
    return eventStatus === eventStatuses.ACTIVE;
};
