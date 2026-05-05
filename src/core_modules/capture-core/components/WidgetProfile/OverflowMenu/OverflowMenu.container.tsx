import React, { useEffect } from 'react';
import { useAuthorities } from 'capture-core/utils/authority/useAuthorities';
import type { Props } from './OverflowMenu.types';
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
}: Props) => {
    const { hasAuthority } = useAuthorities({ authorities: ['F_TEI_CASCADE_DELETE'] });

    useEffect(() => {
        const yn = (v?: boolean) => (v ? 'Yes' : 'No');
        // eslint-disable-next-line no-console
        console.log(`Cascade delete TEI: ${yn(hasAuthority)}`);
    }, [canWriteData, hasAuthority]);

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
