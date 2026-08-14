import React from 'react';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';

type Props = {
    eventAccess: { read: boolean; write: boolean };
    isEventBlockedByExpiry: boolean;
    isFormBlockedByCompletion: boolean;
};

export const ViewEventReadOnlyBadge = ({
    eventAccess,
    isEventBlockedByExpiry,
    isFormBlockedByCompletion,
}: Props) => (
    <ReadOnlyBadge
        programWriteAccess={eventAccess.write}
        isEventBlockedByExpiry={isEventBlockedByExpiry}
        isFormBlockedByCompletion={isFormBlockedByCompletion}
        inlineLabel
    />
);
