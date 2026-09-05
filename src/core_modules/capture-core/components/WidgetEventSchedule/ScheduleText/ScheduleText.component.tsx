import i18n from '@dhis2/d2-i18n';
import React from 'react';
import { InfoIconText } from '../../InfoIconText';
import type { Props } from './scheduleText.types';
import { useTermLabel } from '../../../metaData';

export const ScheduleText = ({ orgUnitName, stageName, programName, programId, stageId }: Props) => {
    const eventLabel = useTermLabel('event', { programId, stageId });
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
