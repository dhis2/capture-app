// @flow
import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetFeedback.types';
import { WidgetFeedbackContent } from './WidgetFeedbackContent/WidgetFeedbackContent';

export const WidgetFeedback = ({ className, feedbackRules }: Props) => {
    const [openStatus, setOpenStatus] = useState(false);

    const { filteredText, filteredKeyValue } = useMemo(() => {
        const data = {
            filteredText: [],
            filteredKeyValue: [],
        };
        data.filteredText = feedbackRules.filter(item => item.type === 'DISPLAYTEXT');
        data.filteredKeyValue = feedbackRules.filter(item => item.type === 'DISPLAYKEYVALUEPAIR');

        return data;
    }, [feedbackRules]);

    return (
        <div
            className={className}
        >
            <Widget
                header={i18n.t('Feedback')}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={openStatus}
            >
                <WidgetFeedbackContent
                    filteredText={filteredText}
                    filteredKeyValue={filteredKeyValue}
                />
            </Widget>
        </div>
    );
};
