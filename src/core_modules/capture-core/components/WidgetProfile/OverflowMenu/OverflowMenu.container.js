// @flow
import React from 'react';
import type { Props } from './OverflowMenu.types';
import { OverflowMenuComponet } from './OverflowMenu.component';
import { useAuthorities } from './hooks';

export const OverflowMenu = ({ trackedEntityTypeName, canWriteData, trackedEntity, onDeleteSuccess }: Props) => {
    const { canCascadeDeleteTei } = useAuthorities();

    return (
        <OverflowMenuComponet
            trackedEntityTypeName={trackedEntityTypeName}
            canWriteData={canWriteData}
            canCascadeDeleteTei={canCascadeDeleteTei}
            trackedEntity={trackedEntity}
            onDeleteSuccess={onDeleteSuccess}
        />
    );
};
