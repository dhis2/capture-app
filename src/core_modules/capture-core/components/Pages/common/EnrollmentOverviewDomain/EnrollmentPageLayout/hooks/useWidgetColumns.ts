import { useCallback, useMemo } from 'react';
import type {
    ColumnConfig,
    PageLayoutConfig,
    WidgetConfig,
} from '../DefaultEnrollmentLayout.types';
import { renderWidgets } from '../renderPageComponents';

type Props = {
    pageLayout: PageLayoutConfig,
    availableWidgets: Readonly<Record<string, WidgetConfig>>,
    props: Record<string, any>,
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

    const createColumnWidgets = useCallback((column: Array<ColumnConfig> | null) =>
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
