import React from 'react';
import { Tooltip } from '@dhis2/ui';
import { useFormatOrgUnitNameFullPath } from '../../../metadataRetrieval/orgUnitName';

export const TooltipOrgUnit = ({ orgUnitName, ancestors }) => {
    const orgUnitNameFullPath = useFormatOrgUnitNameFullPath(orgUnitName, ancestors);
    return (
        <Tooltip content={orgUnitNameFullPath} openDelay={400}>
            <span style={{ textDecoration: 'underline dotted' }}>
                {orgUnitName}
            </span>
        </Tooltip>
    );
};
