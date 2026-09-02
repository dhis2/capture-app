import React from 'react';
import { InfoIconText } from '../../InfoIconText';
import type { Props } from './scheduleText.types';
import { useTermLabel } from '../../../metaData';
import { tCustomTerm } from '../../../utils/tCustomTerm';

export const ScheduleText = ({ orgUnitName, stageName, programName, programId, stageId }: Props) => {
    const eventLabel = useTermLabel('event', { programId, stageId });
    return (
        <InfoIconText>
            <span>
                {orgUnitName
                    ? tCustomTerm('Scheduling an {{eventLabel}} in {{stageName}} for {{programName}} in {{orgUnitName}}',
                        { orgUnitName, stageName, programName, eventLabel })
                    : tCustomTerm('Scheduling an {{eventLabel}} in {{stageName}} for {{programName}}',
                        { stageName, programName, eventLabel })}
            </span>
        </InfoIconText>
    );
};
