import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

import type { FilteredFeedbackKeyValue, FeedbackProps } from '../WidgetFeedback.types';

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

export const useLegendSetsById = ({feedback}: { feedback: FeedbackProps['feedback'] }) => {
    const legendSetIds = useMemo(
        () => [
            ...new Set(
                (feedback ?? [])
                    .filter(
                        (rule): rule is FilteredFeedbackKeyValue =>
                            typeof rule === 'object' && ('key' in rule || 'value' in rule),
                    )
                    .map(rule => rule.legendSetId)
                    .filter((id): id is string => !!id),
            ),
        ],
        [feedback],
    );

    const {data: legendSetData} = useDataQuery(legendSetQuery, {
        variables: {ids: legendSetIds.join(',')},
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
        const numeric = Number.parseFloat(value);
        if (Number.isNaN(numeric)) return undefined;
        return legends.find(l => numeric >= l.startValue && numeric < l.endValue)?.color;
    };

    return {
        resolveColor,
    };
};
