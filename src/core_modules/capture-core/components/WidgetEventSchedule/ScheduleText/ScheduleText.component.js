// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { InfoIconText } from '../../InfoIconText';
import type { Props } from './scheduleText.types';

export const ScheduleText = ({ orgUnitName, stageName, programName }: Props) => (
    <InfoIconText>
        <span>
            { i18n.t('Scheduling an event in {{stageName}} for {{programName}} in {{orgUnitName}}',
                { orgUnitName, stageName, programName, interpolation: { escapeValue: false } })}
        </span>
    </InfoIconText>
);

