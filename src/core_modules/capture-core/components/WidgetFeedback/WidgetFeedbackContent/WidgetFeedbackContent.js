// @flow

import React, { type ComponentType } from 'react';
import { spacers, spacersNum, colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { FilteredKeyValue, FilteredText, ContentType } from '../WidgetFeedback.types';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        paddingLeft: spacersNum.dp16,
        marginTop: '0px',
        lineHeight: '1.375',
        fontSize: spacers.dp16,
        color: colors.grey900,
    },
    noFeedbackText: {
        color: colors.grey600,
        paddingLeft: spacersNum.dp16,
        fontWeight: 400,
        fontSize: spacers.dp16,
        marginTop: '0px',
    },
    listItem: {
        marginBottom: spacersNum.dp4,
        '&::marker': {
            color: colors.grey500,
        },
    },
};


const WidgetFeedbackContentComponent = ({ widgetData, noFeedbackText, classes }: ContentType) => {
    if (!widgetData?.length) {
        return <p data-test={'widget-content'} className={classes.noFeedbackText}>{noFeedbackText}</p>;
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

export const WidgetFeedbackContent: ComponentType<$Diff<ContentType, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
