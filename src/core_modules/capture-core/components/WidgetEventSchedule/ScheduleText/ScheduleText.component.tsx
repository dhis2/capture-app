import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { InfoIconText } from '../../InfoIconText';
import { useStageLabel } from '../../../metaData';
import type { Props } from './scheduleText.types';

export const ScheduleText = ({ orgUnitName, stageName, programName }: Props) => {
    const event = useStageLabel('event') ?? i18n.t('event');
    return (
        <InfoIconText>
            <span>
                {orgUnitName
                    ? i18n.t('Scheduling {{event}} in {{stageName}} for {{programName}} in {{orgUnitName}}',
                        { event, orgUnitName, stageName, programName, interpolation: { escapeValue: false } })
                    : i18n.t('Scheduling {{event}} in {{stageName}} for {{programName}}',
                        { event, stageName, programName, interpolation: { escapeValue: false } })}
            </span>
        </InfoIconText>
    );
};
