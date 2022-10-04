// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { referralStatus } from './constants';
import { useReferral } from './useReferral';
import type { Props } from './widgetReferral.types';
import { ReferralActions } from './ReferralActions';

export const WidgetReferral = ({ programStageId }: Props) => {
    const { currentReferralStatus } = useReferral(programStageId);

    const renderWidget = () => {
        switch (currentReferralStatus) {
        case referralStatus.REFERRABLE:
            return <ReferralActions />;
        case referralStatus.AMBIGUOUS_REFERRALS:
            return (<div>
                {i18n.t('Ambigous referrals, contact system administrator')}
            </div>);
        default:
            return null;
        }
    };

    return renderWidget();
};
