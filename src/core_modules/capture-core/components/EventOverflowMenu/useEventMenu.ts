import { useEventPermissions } from '../../hooks';
import { convertServerToClient } from '../../converters';
import { dataElementTypes } from '../../metaData';
import type { Props } from './EventOverflowMenu.types';

// Resolves what the overflow menu should render for this event. An item shows when the user is
// allowed to perform the action (`useEventPermissions` is the source of truth for that) AND the
// host wired up the handlers it needs - hosts opt into actions by passing the callbacks.
export const useEventMenu = (props: Props) => {
    const occurredAtClient = convertServerToClient(props.occurredAt, dataElementTypes.DATE) as string;
    const completedAtClient = convertServerToClient(props.completedAt, dataElementTypes.DATE) as string;

    const {
        isEventWithinValidPeriod,
        canEditCompletedEvent,
        readOnly,
        canCompleteEvent,
        canSkipEvent,
        canDeleteEvent,
    } = useEventPermissions({
        programId: props.programId,
        stage: props.programStage,
        eventStatus: props.eventStatus,
        occurredAtClient,
        completedAtClient,
    });

    const completion = canCompleteEvent && !!props.onCompletionStatusUpdated;
    const skip = canSkipEvent && !!(props.onStatusMutate || props.onStatusUpdated);
    const del = canDeleteEvent && !!(props.onOptimisticDelete || props.onDeleteSuccess);
    const changelog = !!props.onOpenChangelog;

    return {
        visibility: {
            completion,
            skip,
            delete: del,
            changelog,
            any: [completion, skip, del, changelog].some(Boolean),
        },
        // The delete item stays visible on an expired or completed event, disabled with a tooltip
        // explaining why - hence `readOnly` here rather than folded into `visibility.delete`.
        deleteItemProps: {
            occurredAtClient,
            isEventWithinValidPeriod,
            canEditCompletedEvent,
            disabled: readOnly,
        },
    };
};
