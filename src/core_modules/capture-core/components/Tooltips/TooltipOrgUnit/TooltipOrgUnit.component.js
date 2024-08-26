// @flow
import React from 'react';
import { Tooltip } from '@dhis2/ui';

type Props = {
    orgUnitName: string,
    ancestors?: Array<string>,
    tooltip?: string,
};

export const TooltipOrgUnit = ({ orgUnitName, ancestors = [], tooltip }: Props) => {
    const orgUnitNameFullPath = [...ancestors, orgUnitName].join(' / ');

    const renderTooltipContent = () => (tooltip ? tooltip.split(orgUnitName) : [orgUnitName]);
    const [before, after] = renderTooltipContent();

    return (
        <Tooltip content={orgUnitNameFullPath} openDelay={400} maxWidth={900}>
            <span>
                {tooltip ? (
                    <>
                        {before}
                        <span style={{ textDecoration: 'underline dotted' }}>{orgUnitName}</span>
                        {after}
                    </>
                ) : (
                    <span style={{ textDecoration: 'underline dotted' }}>{orgUnitName}</span>
                )}
            </span>
        </Tooltip>
    );
};
