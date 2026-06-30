import React from 'react';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';

type Props = {
    eventAccess: { read: boolean; write: boolean };
    isEventWithinValidPeriod: boolean;
    canEditCompletedEvent: boolean;
    isWithinCompleteEventsExpiry: boolean;
};

export const ViewEventReadOnlyBadge = ({
    eventAccess,
    isEventWithinValidPeriod,
    canEditCompletedEvent,
    isWithinCompleteEventsExpiry,
}: Props) => (
    <ReadOnlyBadge
        programWriteAccess={eventAccess.write}
        eventWithinValidPeriod={isEventWithinValidPeriod}
        canEditCompletedEvent={canEditCompletedEvent}
        withinCompleteEventsExpiry={isWithinCompleteEventsExpiry}
        inlineLabel
    />
);
