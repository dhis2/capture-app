// @flow
import React, { useCallback, useMemo } from 'react';
import log from 'loglevel';
import { errorCreator } from '../../../../../../../capture-core-utils';

import { WidgetTypes } from '../DefaultEnrollmentLayout.constants';
import type { ColumnConfig, PageLayoutConfig, WidgetConfig } from '../DefaultEnrollmentLayout.types';

type Props = {
    pageLayout: PageLayoutConfig,
    availableWidgets: $ReadOnly<{ [key: string]: WidgetConfig }>,
    props: Object,
};

const MemoizedWidgets: { [key: string]: React$ComponentType<any> } = {};
const renderWidget = (widget: ColumnConfig, availableWidgets, props) => {
    const { type } = widget;

    if (type.toLowerCase() === WidgetTypes.COMPONENT) {
        const { name, settings = {} } = widget;
        const widgetConfig = availableWidgets[name];

        if (!widgetConfig) {
            log.error(errorCreator(`Widget ${name} is not supported`)({ name }));
            return null;
        }

        const { getProps, shouldHideWidget, getCustomSettings } = widgetConfig;

        const hideWidget = shouldHideWidget && shouldHideWidget(props);
        if (hideWidget) return null;

        const widgetProps = getProps(props);
        const customSettings = getCustomSettings && getCustomSettings(settings);

        let Widget = MemoizedWidgets[name];

        if (!Widget) {
            Widget = widgetConfig.Component;
            MemoizedWidgets[name] = React.memo(Widget);
        }

        return (
            <Widget
                {...widgetProps}
                {...customSettings}
                key={name}
            />
        );
    }

    log.error(errorCreator(`Widget type ${type} is not supported`)({ type }));
    return null;
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
        column?.map((widget: ColumnConfig) => renderWidget(widget, availableWidgets, props)).filter(Boolean),
    [availableWidgets, props],
    );

    const leftColumnWidgets = useMemo(() => createColumnWidgets(leftColumn), [leftColumn, createColumnWidgets]);
    const rightColumnWidgets = useMemo(() => createColumnWidgets(rightColumn), [rightColumn, createColumnWidgets]);

    return {
        leftColumnWidgets,
        rightColumnWidgets,
    };
};
