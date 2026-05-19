import React from 'react';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';

type Props = {
    eventAccess: { read: boolean; write: boolean };
    isEventWithinValidPeriod: boolean;
    canEditCompletedEvent: boolean;
};

export const ViewEventReadOnlyBadge = ({
    eventAccess,
    isEventWithinValidPeriod,
    canEditCompletedEvent,
}: Props) => (
    <ReadOnlyBadge
        programWriteAccess={eventAccess.write}
        eventWithinValidPeriod={isEventWithinValidPeriod}
        canEditCompletedEvent={canEditCompletedEvent}
        inlineLabel
    />
);
