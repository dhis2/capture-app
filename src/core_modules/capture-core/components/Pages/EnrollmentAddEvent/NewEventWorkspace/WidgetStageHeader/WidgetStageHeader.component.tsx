import i18n from '@dhis2/d2-i18n';
import React from 'react';
import type { Props } from './widgetStageHeader.types';
import { LabelKeys, useTermLabel } from '../../../../../customLabels';

export const WidgetStageHeader = ({ stage }: Props) => {
    const { eventLabel } = useTermLabel([LabelKeys.eventSingular], { stageId: stage?.id });
    return (
        <div>
            {stage?.stageForm.name ?? i18n.t('New {{eventLabel}}', { eventLabel })}
        </div>
    );
};
