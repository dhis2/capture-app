// @flow

import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import type { Props } from '../WidgetFeedback.types';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        paddingLeft: '15px',
        marginTop: '0px',
        lineHeight: '1.375',
        fontSize: '14px',
        color: '#212934',
    },
    noFeedbackText: {
        color: '#6B7280',
        paddingLeft: '15px',
        fontSize: '14px',
        marginTop: '0px',
    },
    listItem: {
        marginBottom: '5px',
        '&::marker': {
            color: '#A0ADBA',
        },
    },
};

const WidgetFeedbackContentComponent = ({ displayText, displayKeyValue, classes }: Props) => {
    if ((!displayText || displayText.length <= 0) && (!displayKeyValue || displayKeyValue.length <= 0)) {
        return <p className={classes.noFeedbackText}>{i18n.t('No feedback for this enrollment yet')}</p>;
    }

    return (
        <div className={classes.container}>
            <ul className={classes.unorderedList}>
                {displayText && displayText.length > 0 ? displayText.map(item => (
                    item.message && (
                        <li
                            className={classes.listItem}
                            key={item.id}
                        >
                            {item.message}
                        </li>))) : null}
                {displayKeyValue && displayKeyValue.length > 0 ? displayKeyValue.map(item => (
                    item.key && item.value && (
                        <li
                            key={item.id}
                            className={classes.listItem}
                        >
                            {item.key}: {item.value}
                        </li>))) : null}
            </ul>
        </div>
    );
};

export const WidgetFeedbackContent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
