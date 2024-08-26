// @flow
import React from 'react';
import { Tooltip } from '@dhis2/ui';

type Props = {
    orgUnitName: string,
    ancestors?: Array<string>,
    tooltip?: string,
};

export const TooltipOrgUnit = ({ orgUnitName, ancestors = [], tooltip }: Props) => {
    ancestors.push(orgUnitName);
    const orgUnitNameFullPath = ancestors.join(' / ');
    const tooltipParts = tooltip ? tooltip.split(orgUnitName) : [orgUnitName];

    return (
        <Tooltip content={orgUnitNameFullPath} openDelay={400} maxWidth={900}>
            <span>
                {tooltip ? (
                    <>
                        {tooltipParts[0]}
                        <span style={{ textDecoration: 'underline dotted' }}>
                            {orgUnitName}
                        </span>
                        {tooltipParts[1]}
                    </>
                ) : (
                    <span style={{ textDecoration: 'underline dotted' }}>
                        {orgUnitName}
                    </span>
                )}
            </span>
        </Tooltip>
    );
};
