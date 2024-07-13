import React from 'react';
import { Tooltip } from '@dhis2/ui';

export const TooltipOrgUnit = ({ orgUnitName, orgUnitNameFullPath }) => (
    <Tooltip content={orgUnitNameFullPath} openDelay={400}>
        <span style={{ textDecoration: 'underline dotted' }}>
            {orgUnitName}
        </span>
    </Tooltip>
);

