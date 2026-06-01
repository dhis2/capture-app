import React, { type ComponentType, useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { spacersNum, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { MarkdownWrapper } from 'capture-core/components/WidgetFeedback/WidgetFeedbackContent/MarkdownWrapper';
import type {
    FilteredFeedbackKeyValue,
    FeedbackWidgetData,
    FilteredFeedbackText,
    FeedbackProps,
} from '../WidgetFeedback.types';


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

type Legend = { startValue: number; endValue: number; color: string };
type LegendSetApiResponse = { legendSets: Array<{ id: string; legends: Legend[] }> };

const legendSetQuery = {
    legendSets: {
        resource: 'legendSets',
        params: ({ ids }: Record<string, string>) => ({
            fields: 'id,legends[id,startValue,endValue,color]',
            filter: `id:in:[${ids}]`,
            paging: false,
        }),
    },
};

type Props = FeedbackProps & WithStyles<typeof styles>;

const WidgetFeedbackContentComponent = ({ feedback, feedbackEmptyText, classes }: Props) => {
    const legendSetIds = useMemo(() => [...new Set(
        (feedback ?? [])
            .filter((rule): rule is FilteredFeedbackKeyValue =>
                typeof rule === 'object' && ('key' in rule || 'value' in rule))
            .map(rule => rule.legendSetId)
            .filter((id): id is string => !!id),
    )], [feedback]);

    const { data: legendSetData } = useDataQuery(legendSetQuery, {
        variables: { ids: legendSetIds.join(',') },
        lazy: legendSetIds.length === 0,
    });

    const legendSetsById = useMemo<Record<string, Legend[]>>(() => {
        const map: Record<string, Legend[]> = {};
        const response = legendSetData?.legendSets as LegendSetApiResponse | undefined;
        (response?.legendSets ?? []).forEach((ls) => {
            map[ls.id] = ls.legends;
        });
        return map;
    }, [legendSetData]);

    const resolveColor = (legendSetId: string | undefined, value: string): string | undefined => {
        if (!legendSetId) return undefined;
        const legends = legendSetsById[legendSetId];
        if (!legends?.length) return undefined;
        const numeric = parseFloat(value);
        if (isNaN(numeric)) return undefined;
        return legends.find(l => numeric >= l.startValue && numeric < l.endValue)?.color;
    };

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
