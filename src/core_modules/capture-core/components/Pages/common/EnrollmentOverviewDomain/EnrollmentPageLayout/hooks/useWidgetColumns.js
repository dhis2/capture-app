// @flow
import { useCallback, useMemo } from 'react';
import type {
    ColumnConfig,
    PageLayoutConfig,
    WidgetConfig,
} from '../DefaultEnrollmentLayout.types';
import { renderWidgets } from '../renderPageComponents';

type Props = {
    pageLayout: PageLayoutConfig,
    availableWidgets: $ReadOnly<{ [key: string]: WidgetConfig }>,
    props: Object,
};

export const useWidgetColumns = ({
    pageLayout,
    availableWidgets,
    props,
}: Props) => {
    const {
        leftColumn,
        rightColumn,
    } = pageLayout;

    const createColumnWidgets = useCallback(column =>
        column?.map((widget: ColumnConfig) => renderWidgets(widget, availableWidgets, props)).filter(Boolean),
    [availableWidgets, props],
    );

    const leftColumnWidgets = useMemo(() => createColumnWidgets(leftColumn), [leftColumn, createColumnWidgets]);
    const rightColumnWidgets = useMemo(() => createColumnWidgets(rightColumn), [rightColumn, createColumnWidgets]);

    return {
        leftColumnWidgets,
        rightColumnWidgets,
    };
};
