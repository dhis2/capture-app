// @flow
import React from 'react';
import { Tooltip } from '@dhis2/ui';

type Props = {
    orgUnitName: string,
    ancestors?: Array<string>,
};

export const TooltipOrgUnit = ({ orgUnitName, ancestors = [] }: Props) => {
    const fullPath = [...ancestors, orgUnitName].join(' / ');

    return (
        <Tooltip content={fullPath} openDelay={400} maxWidth={900}>
            <span style={{ textDecoration: 'underline dotted' }}>{orgUnitName}</span>
        </Tooltip>
    );
};
