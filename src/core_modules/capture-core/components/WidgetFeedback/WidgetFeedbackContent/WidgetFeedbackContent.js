// @flow

import React, { type ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
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
        color: colors.grey900,
    },
    noFeedbackText: {
        color: colors.grey600,
        paddingLeft: '15px',
        fontWeight: 400,
        fontSize: '14px',
        marginTop: '0px',
    },
    listItem: {
        marginBottom: '5px',
        '&::marker': {
            color: colors.grey500,
        },
    },
};


const WidgetFeedbackContentComponent = ({ displayText, displayKeyValue, classes }: Props) => {
    if ((!displayText || displayText.length <= 0) && (!displayKeyValue || displayKeyValue.length <= 0)) {
        return <p className={classes.noFeedbackText}>{i18n.t('No feedback for this enrollment yet')}</p>;
    }

    const renderText = () => (
        displayText && displayText.length > 0 ? displayText.map(item => (
            item.message && (
                <li
                    className={classes.listItem}
                    key={item.id}
                >
                    {item.message}
                </li>))) : null
    );

    const renderKeyValue = () => (
        displayKeyValue && displayKeyValue.length > 0 ? displayKeyValue.map(item => (
            item.key && item.value && (
                <li
                    key={item.id}
                    className={classes.listItem}
                >
                    {item.key}: {item.value}
                </li>))) : null
    );

    return (
        <div className={classes.container}>
            <ul className={classes.unorderedList}>
                {renderText()}
                {renderKeyValue()}
            </ul>
        </div>
    );
};

export const WidgetFeedbackContent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
