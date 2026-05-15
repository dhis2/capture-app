import React from 'react';
import { ReadOnlyBadge } from '../../../ReadOnlyBadge';

type Props = {
    eventAccess: { read: boolean; write: boolean };
};

export const ViewEventReadOnlyBadge = ({ eventAccess }: Props) => {
    if (eventAccess.write) return null;
    return (
        <ReadOnlyBadge
            programWriteAccess={false}
            inlineLabel
        />
    );
};
