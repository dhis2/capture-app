// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { InfoIconText } from '../../InfoIconText';
import type { Props } from './bottomText.types';
import { textMode } from './BottomText.constants';

export const BottomText = ({ orgUnitName, stageName, programName, mode }: Props) => (<InfoIconText>
    <span>
        {mode === textMode.SAVE && i18n.t(`Saving to ${stageName} for ${programName} in ${orgUnitName}`,
            { interpolation: { escapeValue: false } })}
        {mode === textMode.SCHEDULE && i18n.t(`Scheduling an event in ${stageName} for ${programName} in ${orgUnitName}`,
            { interpolation: { escapeValue: false } })}
    </span>
</InfoIconText>);
