// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetFeedback.types';
import { WidgetFeedbackContent } from './WidgetFeedbackContent/WidgetFeedbackContent';

export const WidgetFeedback = ({ displayText, displayKeyValue, classes }: Props) => {
    const [openStatus, setOpenStatus] = useState(true);

    return (
        <div
            className={classes}
        >
            <Widget
                header={i18n.t('Feedback')}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={openStatus}
            >
                <WidgetFeedbackContent
                    displayText={displayText}
                    displayKeyValue={displayKeyValue}
                />
            </Widget>
        </div>
    );
};
