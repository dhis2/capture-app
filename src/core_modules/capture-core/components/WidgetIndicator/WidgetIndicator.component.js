// @flow
import React, { useState } from 'react';
import { Widget } from '../Widget';
import type { IndicatorProps } from '../WidgetFeedback/WidgetFeedback.types';
import { WidgetFeedbackContent } from '../WidgetFeedback/WidgetFeedbackContent/WidgetFeedbackContent';
import { WidgetIndicatorHeader } from './WidgetIndicatorHeader';

export const WidgetIndicator = ({ indicators }: IndicatorProps) => {
    const [openStatus, setOpenStatus] = useState(true);
    return (
        <div>
            <Widget
                header={<WidgetIndicatorHeader numberOfIndicators={indicators?.length} />}
                open={openStatus}
                onClose={() => setOpenStatus(false)}
                onOpen={() => setOpenStatus(true)}
            >
                <WidgetFeedbackContent widgetData={indicators} />
            </Widget>
        </div>
    );
};
