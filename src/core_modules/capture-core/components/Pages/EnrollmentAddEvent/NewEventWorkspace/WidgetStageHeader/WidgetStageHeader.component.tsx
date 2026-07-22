import React from 'react';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './widgetStageHeader.types';

export const WidgetStageHeader = ({ stage }: Props) => (
    <div>
        {stage?.stageForm.name ?? i18n.t('New Event')}
    </div>
);
