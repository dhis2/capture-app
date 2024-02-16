// @flow
import React from 'react';
import log from 'loglevel';
import type {
    ColumnConfig,
    DefaultWidgetColumnConfig,
    PluginWidgetColumnConfig, WidgetConfig,
} from '../DefaultEnrollmentLayout.types';
import { errorCreator } from '../../../../../../../capture-core-utils';
import { EnrollmentPlugin } from '../../../EnrollmentPlugin';
import { WidgetTypes } from '../DefaultEnrollmentLayout.constants';

const MemoizedWidgets: { [key: string]: React$ComponentType<any> } = {};
const UnsupportedWidgets: { [key: string]: boolean } = {};

const renderComponent = (
    widget: ColumnConfig,
    availableWidgets: $ReadOnly<{ [key: string]: WidgetConfig }>,
    props: Object,
) => {
    // Manually casting the type to DefaultWidgetColumnConfig
    const { name, settings = {} } = ((widget: any): DefaultWidgetColumnConfig);
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
};

const getPropsForPlugin = ({ program, enrollmentId, teiId, orgUnitId }) => ({
    programId: program.id,
    enrollmentId,
    teiId,
    orgUnitId,
});

const renderPlugin = (
    widget: ColumnConfig,
    availableWidgets: $ReadOnly<{ [key: string]: WidgetConfig }>,
    props: Object,
) => {
    // Manually casting the type to PluginWidgetColumnConfig
    const { source } = ((widget: any): PluginWidgetColumnConfig);
    let PluginWidget = MemoizedWidgets[source];

    if (!PluginWidget) {
        PluginWidget = EnrollmentPlugin;
        MemoizedWidgets[source] = (PluginWidget);
    }
    const widgetProps = getPropsForPlugin(props);

    return (
        <PluginWidget
            key={source}
            pluginSource={source}
            {...widgetProps}
        />
    );
};

export const renderWidgets = (
    widget: ColumnConfig,
    availableWidgets: $ReadOnly<{ [key: string]: WidgetConfig }>,
    props: Object,
) => {
    const { type } = widget;

    if (type.toLowerCase() === WidgetTypes.COMPONENT) {
        return renderComponent(widget, availableWidgets, props);
    } else if (type.toLowerCase() === WidgetTypes.PLUGIN) {
        return renderPlugin(widget, availableWidgets, props);
    }

    log.error(errorCreator(`Widget type ${type} is not supported`)({ type }));
    return null;
};
