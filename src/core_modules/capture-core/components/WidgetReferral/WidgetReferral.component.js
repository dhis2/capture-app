// @flow
import * as React from 'react';
import { useReferral } from './useReferral';
import type { Props } from './widgetReferral.types';
import { ReferralActions } from './ReferralActions';

export const WidgetReferral = ({ programStageId }: Props) => {
    const { currentReferralStatus } = useReferral(programStageId);

    return currentReferralStatus !== undefined ? <ReferralActions type={currentReferralStatus} /> : null;
};
