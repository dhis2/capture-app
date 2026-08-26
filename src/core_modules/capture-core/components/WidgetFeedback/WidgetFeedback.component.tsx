import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import { WidgetFeedbackContent } from './WidgetFeedbackContent/WidgetFeedbackContent';
import type { FeedbackProps } from './WidgetFeedback.types';

export const WidgetFeedbackComponent = ({ feedback, feedbackEmptyText }: FeedbackProps) => {
    const [openStatus, setOpenStatus] = useState(true);

    return (
        <div
            data-test="feedback-widget"
        >
            <Widget
                header={i18n.t('Feedback')}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={openStatus}
            >
                <WidgetFeedbackContent
                    feedback={feedback}
                    feedbackEmptyText={feedbackEmptyText}
                />
            </Widget>
        </div>
    );
};
