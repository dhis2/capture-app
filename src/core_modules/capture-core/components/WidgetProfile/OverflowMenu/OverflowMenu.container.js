// @flow
import React from 'react';
import type { Props } from './OverflowMenu.types';
import { OverflowMenuComponent } from './OverflowMenu.component';
import { useAuthorities } from './hooks';

export const OverflowMenu = ({
    trackedEntityTypeName,
    canWriteData,
    trackedEntity,
    onDeleteSuccess,
    displayChangelog,
    teiId,
    programAPI,
}: Props) => {
    const { canCascadeDeleteTei } = useAuthorities();

    return (
        <OverflowMenuComponent
            trackedEntityTypeName={trackedEntityTypeName}
            canWriteData={canWriteData}
            canCascadeDeleteTei={canCascadeDeleteTei}
            trackedEntity={trackedEntity}
            onDeleteSuccess={onDeleteSuccess}
            displayChangelog={displayChangelog}
            teiId={teiId}
            programAPI={programAPI}
        />
    );
};
