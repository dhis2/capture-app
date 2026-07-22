import React, { type ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { MarkdownWrapper } from './MarkdownWrapper';
import type {
    FilteredFeedbackKeyValue,
    FeedbackWidgetData,
    FilteredFeedbackText,
    FeedbackProps,
} from '../WidgetFeedback.types';
import { useLegendSetsById } from './useLegendSetsById';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp12}px`,
        maxHeight: '70vh',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
    },
    unorderedList: {
        paddingInlineStart: spacersNum.dp16,
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
    const { resolveColor } = useLegendSetsById({ feedback });

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
            <MarkdownWrapper title={item.message} />
        </li>
    );

    const renderKeyValue = (item: FilteredFeedbackKeyValue) => {
        const color = resolveColor(item.legendSetId, item.value);
        return (
            <li
                key={item.id}
                className={classes.listItem}
            >
                <MarkdownWrapper title={item.key} content={item.value} color={color} />
            </li>
        );
    };

    return (
        <div
            data-test="widget-content"
            className={classes.container}
        >
            <ul className={classes.unorderedList}>
                {feedback.map((rule: FeedbackWidgetData) => {
                    if (typeof rule === 'object') {
                        if ('key' in rule || 'value' in rule) {
                            return renderKeyValue(rule as FilteredFeedbackKeyValue);
                        } else if ('message' in rule) {
                            return renderTextObject(rule as FilteredFeedbackText);
                        }
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export const WidgetFeedbackContent =
    withStyles(styles)(WidgetFeedbackContentComponent) as ComponentType<FeedbackProps>;
