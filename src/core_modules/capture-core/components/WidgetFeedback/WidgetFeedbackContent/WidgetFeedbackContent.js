// @flow

import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { contentProps } from '../WidgetFeedback.types';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        paddingLeft: '20px',
        lineHeight: '1.375',
        fontSize: '14px',
        color: '#212934',
    },
    noFeedbackText: {
        color: '#6B7280',
    },
    listItem: {
        marginBottom: '5px',
        '&::marker': {
            color: '#A0ADBA',
        },
    },
};

const WidgetFeedbackContentComponent = ({ feedbackDisplayText, feedbackKeyValuePair, classes }: contentProps) => {

    return (
        <div className={classes.container}>
            {!feedbackDisplayText.length > 0 && !feedbackKeyValuePair.length > 0 ?
                <p className={classes.noFeedbackText}>No feedback for this enrollment yet</p> : <ul className={classes.unorderedList}>
                    {feedbackDisplayText && feedbackDisplayText.length > 0 ? feedbackDisplayText.map(item => (
                        <li
                            className={classes.listItem}
                            key={item.displayText.id}
                        >
                            {item.displayText.message}
                        </li>)) : null}
                    {feedbackKeyValuePair && feedbackKeyValuePair.length > 0 ? feedbackKeyValuePair.map(item => (
                        <li
                            key={item.id}
                            className={classes.listItem}
                        >
                            {item.displayKeyValuePair.key}: {item.displayKeyValuePair.value}
                        </li>)) : null}
                </ul>
            }

        </div>
    );
};

export const WidgetFeedbackContent: ComponentType<$Diff<contentProps, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
