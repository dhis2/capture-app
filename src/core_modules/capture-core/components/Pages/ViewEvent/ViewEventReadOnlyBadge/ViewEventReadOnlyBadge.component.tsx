import React from 'react';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';

type Props = {
    eventAccess: { read: boolean; write: boolean };
    isEventBlockedByExpiry: boolean;
    isEventBlockedByCompletion: boolean;
};

export const ViewEventReadOnlyBadge = ({
    eventAccess,
    isEventBlockedByExpiry,
    isEventBlockedByCompletion,
}: Props) => (
    <ReadOnlyBadge
        programWriteAccess={eventAccess.write}
        isEventBlockedByExpiry={isEventBlockedByExpiry}
        isEventBlockedByCompletion={isEventBlockedByCompletion}
        inlineLabel
    />
);
