import React from 'react';

import { useAuthority } from '../../../utils/authority/useAuthority';
import { Authorities } from '../../../utils/authority/authorities';
import type { Props } from './OverflowMenu.types';
import { OverflowMenuComponent } from './OverflowMenu.component';

export const OverflowMenu = ({
    trackedEntityTypeName,
    canWriteData,
    canToggleStatus,
    trackedEntityInactive,
    trackedEntity,
    trackedEntityForToggle,
    trackedEntityData,
    onDeleteSuccess,
    onStatusToggleSuccess,
    displayChangelog,
    teiId,
    programAPI,
    readOnlyMode,
}: Props) => {
    const { hasAuthority } = useAuthority(Authorities.TEI_CASCADE_DELETE);

    return (
        <OverflowMenuComponent
            trackedEntityTypeName={trackedEntityTypeName}
            canWriteData={canWriteData}
            canCascadeDeleteTei={hasAuthority}
            canToggleStatus={canToggleStatus}
            trackedEntityInactive={trackedEntityInactive}
            trackedEntity={trackedEntity}
            trackedEntityForToggle={trackedEntityForToggle}
            trackedEntityData={trackedEntityData}
            onDeleteSuccess={onDeleteSuccess}
            onStatusToggleSuccess={onStatusToggleSuccess}
            displayChangelog={displayChangelog}
            teiId={teiId}
            programAPI={programAPI}
            readOnlyMode={readOnlyMode}
        />
    );
};
