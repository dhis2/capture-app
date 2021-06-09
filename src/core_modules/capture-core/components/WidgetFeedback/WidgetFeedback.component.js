// @flow
import React, { type ComponentType, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Widget } from '../Widget';
import type { Props } from './WidgetFeedback.types';
import { WidgetFeedbackContent } from './WidgetFeedbackContent/WidgetFeedbackContent';

const styles = {
    feedbackWidgetWrapper: {
        paddingBottom: '12px',
    },
};

const WidgetFeedbackPlain = ({ feedback, classes }: Props) => {
    const [openStatus, setOpenStatus] = useState(true);

    return (
        <div
            className={classes.feedbackWidgetWrapper}
            data-test={'feedback-widget'}
        >
            <Widget
                header={i18n.t('Feedback')}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
                open={openStatus}
            >
                <WidgetFeedbackContent
                    widgetData={feedback}
                />
            </Widget>
        </div>
    );
};

export const WidgetFeedback: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetFeedbackPlain)
