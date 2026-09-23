import React from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type {
    ColumnConfig,
    DefaultWidgetColumnConfig,
    PluginWidgetColumnConfig, WidgetConfig,
} from '../DefaultEnrollmentLayout.types';
import type { PluginContextIds } from '../../../../../D2Form/FormFieldPlugin/FormFieldPlugin.types';
import { EnrollmentPlugin } from '../../../EnrollmentPlugin';
import { WidgetTypes } from '../DefaultEnrollmentLayout.constants';

type PluginPropsInput = {
    program?: { id: string };
    programStage?: { id: string };
    stageId?: string;
    eventId?: string;
    enrollmentId?: string;
    teiId?: string;
    ownerOrgUnitId?: string;
};

const MemoizedWidgets: Record<string, React.ComponentType<any>> = {};
const UnsupportedWidgets: Record<string, boolean> = {};

const renderComponent = (
    widget: ColumnConfig,
    availableWidgets: Readonly<Record<string, WidgetConfig>>,
    props: Record<string, any>,
) => {
    const { name, settings = {} } = (widget as any) as DefaultWidgetColumnConfig;
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

    try {
        widgetProps = getProps(props);
    } catch (error) {
        log.error(errorCreator(`Error while getting widget props for widget ${name}`)({ error, props }));
        return null;
    }
    const customSettings = getCustomSettings && getCustomSettings(settings);

    if (!MemoizedWidgets[name]) {
        MemoizedWidgets[name] = React.memo(widgetConfig.Component);
    }
    const Widget = MemoizedWidgets[name];

    return React.createElement(Widget, {
        ...widgetProps,
        ...customSettings,
        key: name,
    });
};

const getPropsForPlugin = ({
    program,
    programStage,
    stageId,
    eventId,
    enrollmentId,
    teiId,
    ownerOrgUnitId,
}: PluginPropsInput): PluginContextIds => ({
    programId: program?.id,
    programStageId: stageId ?? programStage?.id,
    eventId,
    enrollmentId,
    teiId,
    orgUnitId: ownerOrgUnitId,
});

const renderPlugin = (
    widget: ColumnConfig,
    availableWidgets: Readonly<Record<string, WidgetConfig>>,
    props: Record<string, any>,
) => {
    const { source } = (widget as any) as PluginWidgetColumnConfig;
    let PluginWidget = MemoizedWidgets[source];

    if (!PluginWidget) {
        PluginWidget = EnrollmentPlugin;
        MemoizedWidgets[source] = (PluginWidget);
    }
    const widgetProps = getPropsForPlugin(props);

    return React.createElement(PluginWidget, {
        key: source,
        pluginSource: source,
        ...widgetProps,
    });
};

export const renderWidgets = (
    widget: ColumnConfig,
    availableWidgets: Readonly<Record<string, WidgetConfig>>,
    props: Record<string, any>,
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
