import React from 'react';
import type { Props } from './widgetStageHeader.types';
import { useTermLabel } from '../../../../../metaData';
import { tCustomTerm } from '../../../../../utils/tCustomTerm';

export const WidgetStageHeader = ({ stage }: Props) => {
    const eventLabel = useTermLabel('event');
    return (
        <div>
            {stage?.stageForm.name ?? tCustomTerm('New {{eventLabel}}', { eventLabel })}
        </div>
    );
};
