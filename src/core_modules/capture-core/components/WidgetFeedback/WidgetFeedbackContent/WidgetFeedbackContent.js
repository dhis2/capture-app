// @flow

import React, { type ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import type { filteredKeyValue, filteredText, contentType } from '../WidgetFeedback.types';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        paddingLeft: spacersNum.dp16,
        marginTop: '0px',
        lineHeight: '1.375',
        fontSize: '14px',
        color: colors.grey900,
    },
    noFeedbackText: {
        color: colors.grey600,
        paddingLeft: spacersNum.dp16,
        fontWeight: 400,
        fontSize: '14px',
        marginTop: '0px',
    },
    listItem: {
        marginBottom: spacersNum.dp4,
        '&::marker': {
            color: colors.grey500,
        },
    },
};


const WidgetFeedbackContentComponent = ({ widgetData, classes }: contentType) => {
    if (!widgetData?.length) {
        return <p data-test={'widget-content'} className={classes.noFeedbackText}>{i18n.t('No feedback for this enrollment yet')}</p>;
    }

    const renderTextObject = (item: filteredText) => (
        <li
            className={classes.listItem}
            key={item.id}
        >
            {item.message}
        </li>
    );

    const renderKeyValue = (item: filteredKeyValue) => (
        <li
            key={item.id}
            className={classes.listItem}
        >
            {item.key}{item.value ? `: ${item.value}` : null}
        </li>
    );

    const renderString = (item: string, index: number) => (
        <li
            key={index}
            className={classes.listItem}
        >
            {item}
        </li>
    );

    return (
        <div
            data-test={'widget-content'}
            className={classes.container}
        >
            <ul className={classes.unorderedList}>
                {widgetData.map((rule: any, index: number) => {
                    if (rule.key) {
                        return renderKeyValue(rule);
                    } else if (rule.message) {
                        return renderTextObject(rule);
                    } else if (typeof rule === 'string') {
                        return renderString(rule, index);
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export const WidgetFeedbackContent: ComponentType<$Diff<contentType, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
