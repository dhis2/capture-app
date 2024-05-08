// @flow

import React, { type ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { FilteredKeyValue, FilteredText, ContentType, WidgetData } from '../WidgetFeedback.types';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        paddingLeft: spacersNum.dp16,
        marginTop: 0,
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
    },
    noFeedbackText: {
        color: colors.grey600,
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '19px',
        marginTop: 0,
    },
    listItem: {
        '&::marker': {
            color: colors.grey500,
        },
    },
};


const WidgetFeedbackContentComponent = ({ widgetData, emptyText, classes }: ContentType) => {
    if (!widgetData?.length) {
        return (
            <div
                data-test="widget-content"
                className={classes.container}
            >
                <p className={classes.noFeedbackText}>{emptyText}</p>
            </div>
        );
    }

    const renderTextObject = (item: FilteredText) => (
        <li
            className={classes.listItem}
            key={item.id}
        >
            {item.message}
        </li>
    );

    const renderKeyValue = (item: FilteredKeyValue) => (
        <li
            key={item.id}
            className={classes.listItem}
        >
            {item.key}{item.key && item.value ? ': ' : null}{item.value}
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
            data-test="widget-content"
            className={classes.container}
        >
            <ul className={classes.unorderedList}>
                {widgetData.map((rule: WidgetData, index: number) => {
                    if (typeof rule === 'object') {
                        if (rule.key || rule.value) {
                            return renderKeyValue(rule);
                        } else if (rule.message) {
                            return renderTextObject(rule);
                        }
                    } else if (typeof rule === 'string') {
                        return renderString(rule, index);
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export const WidgetFeedbackContent: ComponentType<$Diff<ContentType, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
