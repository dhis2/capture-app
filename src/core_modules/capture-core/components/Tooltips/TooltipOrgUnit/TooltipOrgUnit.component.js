// @flow
import React from 'react';
import { Tooltip } from '@dhis2/ui';

type Props = {
    orgUnitName: string,
    ancestors?: Array<string>,
    tooltip?: string,
};

export const TooltipOrgUnit = ({ orgUnitName, ancestors = [], tooltip }: Props) => {
    const fullPath = [...ancestors, orgUnitName].join(' / ');
    const [before, after] = tooltip ? tooltip.split(orgUnitName) : [orgUnitName];

    const renderTooltip = (
        <Tooltip content={fullPath} openDelay={400} maxWidth={900}>
            <span style={{ textDecoration: 'underline dotted' }}>{orgUnitName}</span>
        </Tooltip>
    );

    return tooltip ? <span>{before}{renderTooltip}{after}</span> : renderTooltip;
};
