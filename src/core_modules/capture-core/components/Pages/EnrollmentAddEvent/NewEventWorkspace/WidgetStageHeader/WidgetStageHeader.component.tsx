import i18n from '@dhis2/d2-i18n';
import React from 'react';
import type { Props } from './widgetStageHeader.types';
import { useTermLabel } from '../../../../../metaData';

export const WidgetStageHeader = ({ stage }: Props) => {
    const eventLabel = useTermLabel('event');
    return (
        <div>
            {stage?.stageForm.name ?? i18n.t('New {{eventLabel}}', { eventLabel })}
        </div>
    );
};
