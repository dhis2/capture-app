// @flow
import React from 'react';
import { spacersNum } from '@dhis2/ui';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { Props } from './widgetStageHeader.types';

export const WidgetStageHeader = ({
    stage,
}: Props) => (
    <div className="header">
        {stage?.icon && (
            <div className="icon">
                <NonBundledDhis2Icon
                    name={stage?.icon?.name}
                    color={stage?.icon?.color}
                    width={30}
                    height={30}
                    cornerRadius={2}
                />
            </div>
        )}
        <span>{stage?.name}</span>

        <style jsx>{`
            .header {
                display: flex;
                align-items: center;
                padding: ${spacersNum.dp8}px;
            }
            
            .icon {
                padding-right: ${spacersNum.dp8}px;
            }
        `}</style>
    </div>
);

