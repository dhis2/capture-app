// @flow
import React from 'react';
import { Tooltip } from '@dhis2/ui';
import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';

type Props = {
    orgUnitId: string,
};

export const TooltipOrgUnit = ({ orgUnitId }: Props) => {
    const { displayName, ancestors = [] } = useOrgUnitNameWithAncestors(orgUnitId);
    const fullPath = [...ancestors, displayName].join(' / ');

    return (
        <Tooltip content={fullPath} openDelay={600} maxWidth={900}>
            <span style={{ textDecoration: 'underline dotted' }}>{displayName}</span>
        </Tooltip>
    );
};
