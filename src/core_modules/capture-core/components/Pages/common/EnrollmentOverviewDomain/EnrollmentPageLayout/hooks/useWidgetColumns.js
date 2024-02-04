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
const UnsupportedWidgets: { [key: string]: boolean } = {};

const renderWidget = (widget: ColumnConfig, availableWidgets, props) => {
    const { type } = widget;

    if (type.toLowerCase() === WidgetTypes.COMPONENT) {
        const { name, settings = {} } = widget;
        const widgetConfig = availableWidgets[name];

        if (!widgetConfig) {
            if (!UnsupportedWidgets[name]) {
                log.error(errorCreator(`Widget ${name} is not supported`)({ name }));
                UnsupportedWidgets[name] = true;
            }
            return null;
        }

        const { getProps, shouldHideWidget, getCustomSettings } = widgetConfig;

        const hideWidget = shouldHideWidget && shouldHideWidget(props);
        if (hideWidget) return null;
        let widgetProps = {};

        // In case the widget is not supported, we don't want to crash the app
        try {
            widgetProps = getProps(props);
        } catch (error) {
            log.error(errorCreator(`Error while getting widget props for widget ${name}`)({ error, props }));
            return null;
        }
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
