import React from 'react';
import { Button } from '@dhis2/ui';
import type { PlainProps } from './TrackedEntityInstance.types';

export const TrackedEntityInstance = ({ id, displayName, name, orgUnitId }: PlainProps) => {
    const handleClick = () => {
        console.log('Navigate to TEI:', { id, displayName: displayName || name, orgUnitId });
    };

    return (
        <Button onClick={handleClick}>
            {displayName || name}
        </Button>
    );
};
