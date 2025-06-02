import React from 'react';
import { useAuthorities } from 'capture-core/utils/authority/useAuthorities';
import type { OverflowMenuProps } from './types/overflowMenu.types';
import { OverflowMenuComponent } from './OverflowMenu.component';

export const OverflowMenu = ({
    trackedEntityTypeName,
    canWriteData,
    trackedEntity,
    trackedEntityData,
    onDeleteSuccess,
    displayChangelog,
    teiId,
    programAPI,
    readOnlyMode,
}: OverflowMenuProps) => {
    const { hasAuthority } = useAuthorities({ authorities: ['F_TEI_CASCADE_DELETE'] });

    return (
        <OverflowMenuComponent
            trackedEntityTypeName={trackedEntityTypeName}
            canWriteData={canWriteData}
            canCascadeDeleteTei={hasAuthority}
            trackedEntity={trackedEntity}
            trackedEntityData={trackedEntityData}
            onDeleteSuccess={onDeleteSuccess}
            displayChangelog={displayChangelog}
            teiId={teiId}
            programAPI={programAPI}
            readOnlyMode={readOnlyMode}
        />
    );
};
