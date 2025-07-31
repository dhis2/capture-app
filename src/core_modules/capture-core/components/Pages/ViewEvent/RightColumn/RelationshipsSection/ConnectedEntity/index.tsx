import React from 'react';
import { TrackedEntityInstance } from './TrackedEntityInstance';

type Props = {
    entityType: string;
    id: string;
    displayName?: string;
    name?: string;
    orgUnitId: string;
    [key: string]: any;
};

export const ConnectedEntity = ({ entityType, ...passOnProps }: Props) => {
    if (entityType === 'TRACKED_ENTITY_INSTANCE') {
        const props = {
            ...passOnProps,
            displayName: passOnProps.displayName || passOnProps.name || '',
        };
        return <TrackedEntityInstance {...props} />;
    }

    return null;
};
