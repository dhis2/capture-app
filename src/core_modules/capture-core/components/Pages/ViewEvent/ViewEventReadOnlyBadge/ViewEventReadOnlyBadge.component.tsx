import React from 'react';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';

type Props = {
    eventAccess: { read: boolean; write: boolean };
    canEditExpiredEvent: boolean;
    canEditCompletedEvent: boolean;
};

export const ViewEventReadOnlyBadge = ({
    eventAccess,
    canEditExpiredEvent,
    canEditCompletedEvent,
}: Props) => (
    <ReadOnlyBadge
        programWriteAccess={eventAccess.write}
        canEditExpiredEvent={canEditExpiredEvent}
        canEditCompletedEvent={canEditCompletedEvent}
        inlineLabel
    />
);
