import React from 'react';
import { Tooltip } from '@dhis2/ui';

export const TooltipOrgUnit = ({ orgUnitPath }) => (
    <Tooltip content={orgUnitPath}>
        <span style={{ textDecoration: 'underline dotted' }}>
            {orgUnitPath}
        </span>
    </Tooltip>
);

