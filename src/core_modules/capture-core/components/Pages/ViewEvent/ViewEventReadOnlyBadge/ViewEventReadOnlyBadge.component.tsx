import React from 'react';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';
import { eventStatuses } from '../../../WidgetEventEdit/constants/status.const';

type Props = {
    eventAccess: { read: boolean; write: boolean };
    eventStatus?: string;
    isEventWithinValidPeriod: boolean;
    canEditCompletedEvent: boolean;
    isWithinCompleteEventsExpiry: boolean;
};

export const ViewEventReadOnlyBadge = ({
    eventAccess,
    eventStatus,
    isEventWithinValidPeriod,
    canEditCompletedEvent,
    isWithinCompleteEventsExpiry,
}: Props) => (
    <ReadOnlyBadge
        programWriteAccess={eventAccess.write}
        eventWithinValidPeriod={isEventWithinValidPeriod}
        canEditCompletedEvent={canEditCompletedEvent}
        withinCompleteEventsExpiry={isWithinCompleteEventsExpiry}
        eventIsSkipped={eventStatus === eventStatuses.SKIPPED}
        inlineLabel
    />
);
