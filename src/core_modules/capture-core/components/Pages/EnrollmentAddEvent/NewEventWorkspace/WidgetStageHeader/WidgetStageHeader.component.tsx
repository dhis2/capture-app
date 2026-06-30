import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { useStageLabel } from '../../../../../metaData';
import type { Props } from './widgetStageHeader.types';

export const WidgetStageHeader = ({ stage }: Props) => {
    const event = useStageLabel('event', { stageId: stage?.id }) ?? i18n.t('Event');
    return (
        <div>
            {stage?.stageForm.name ?? i18n.t('New {{event}}', { event })}
        </div>
    );
};
