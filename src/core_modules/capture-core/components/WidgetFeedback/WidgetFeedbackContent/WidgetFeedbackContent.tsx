import React, { type ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type {
    FilteredFeedbackKeyValue,
    FeedbackWidgetData,
    FilteredFeedbackText,
    FeedbackProps,
} from '../WidgetFeedback.types';

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

type Props = FeedbackProps & WithStyles<typeof styles>;

const WidgetFeedbackContentComponent = ({ feedback, feedbackEmptyText, classes }: Props) => {
    if (!feedback?.length) {
        return (
            <div
                data-test="widget-content"
                className={classes.container}
            >
                <p className={classes.noFeedbackText}>{feedbackEmptyText}</p>
            </div>
        );
    }

    const renderTextObject = (item: FilteredFeedbackText) => (
        <li
            className={classes.listItem}
            key={item.id}
        >
            {item.message}
        </li>
    );

    const renderKeyValue = (item: FilteredFeedbackKeyValue) => (
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
                {feedback.map((rule: FeedbackWidgetData, index: number) => {
                    if (typeof rule === 'object') {
                        if ('key' in rule || 'value' in rule) {
                            return renderKeyValue(rule as FilteredFeedbackKeyValue);
                        } else if ('message' in rule) {
                            return renderTextObject(rule as FilteredFeedbackText);
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

export const WidgetFeedbackContent =
    withStyles(styles)(WidgetFeedbackContentComponent) as ComponentType<FeedbackProps>;
