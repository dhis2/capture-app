// @flow
import React, { useState } from 'react';
import { Widget } from '../Widget';
import type { IndicatorProps } from '../WidgetFeedback/WidgetFeedback.types';
import { WidgetIndicatorContent } from './WidgetIndicatorContent/WidgetIndicatorContent';

export const WidgetIndicator = ({ indicators }: IndicatorProps) => {
    const [openStatus, setOpenStatus] = useState(true);
    return (
        <div>
            <Widget
                header={'Indicators'}
                open={openStatus}
                onClose={() => setOpenStatus(false)}
                onOpen={() => setOpenStatus(true)}
            >
                <WidgetIndicatorContent widgetData={indicators} />
            </Widget>
        </div>
    );
};
