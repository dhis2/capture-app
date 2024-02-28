// @flow
import React, { useMemo } from 'react';
import type { Props } from './OverflowMenu.types';
import { OverflowMenuComponet } from './OverflowMenu.component';
import { useAuthorities } from './useAuthorities';

const auth = {
    F_TEI_CASCADE_DELETE: 'F_TEI_CASCADE_DELETE',
    ALL: 'ALL',
};

export const OverflowMenu = ({ trackedEntityTypeName, canWriteData, trackedEntity, onDeleteSuccess }: Props) => {
    const { authorities } = useAuthorities();
    const canCascadeDeleteTei = useMemo(
        () =>
            authorities &&
            authorities.some(authority => authority === auth.ALL || authority === auth.F_TEI_CASCADE_DELETE),
        [authorities],
    );

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
