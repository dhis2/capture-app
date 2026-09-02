import React from 'react';
import type { Props } from './widgetStageHeader.types';
import { useTermLabel } from '../../../../../metaData';
import { customTerms } from '../../../../../utils/customTerms';

export const WidgetStageHeader = ({ stage }: Props) => {
    const eventLabel = useTermLabel('event');
    return (
        <div>
            {stage?.stageForm.name ?? customTerms.i18n.t('New {{eventLabel}}', { eventLabel })}
        </div>
    );
};
