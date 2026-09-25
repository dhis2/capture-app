import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { InfoIconText } from '../../InfoIconText';
import type { Props } from './scheduleText.types';
import { LabelKeys, useTermLabel } from '../../../customLabels';

export const ScheduleText = ({ orgUnitName, stageName, programName, stageId }: Props) => {
    const { eventLabel } = useTermLabel([LabelKeys.eventSingular], { stageId });
    return (
        <InfoIconText>
            <span>
                {orgUnitName
                    ? i18n.t(
                        'Scheduling an {{eventLabel}} in {{stageName}} for {{programName}} in {{orgUnitName}}',
                        { orgUnitName, stageName, programName, eventLabel },
                    )
                    : i18n.t(
                        'Scheduling an {{eventLabel}} in {{stageName}} for {{programName}}',
                        { stageName, programName, eventLabel },
                    )}
            </span>
        </InfoIconText>
    );
};
