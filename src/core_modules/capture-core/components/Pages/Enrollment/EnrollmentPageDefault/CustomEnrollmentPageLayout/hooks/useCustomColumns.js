// @flow
import React, { useMemo } from 'react';
import log from 'loglevel';
import type { ColumnConfig, CustomPageLayoutConfig } from '../CustomEnrollmentPageLayout.types';
import { WidgetsForCustomLayout, WidgetTypes } from '../CustomEnrollmentPageLayout.constants';
import { errorCreator } from '../../../../../../../capture-core-utils';

type Props = {
    customPageLayoutConfig: CustomPageLayoutConfig,
    allProps: Object,
}

const withMemo = (Component: React$ComponentType<any>, widgetProps) => {
    const MemoizedComponent = React.memo(Component);
    return <MemoizedComponent {...widgetProps} />;
};

const renderWidget = ({ type, name }: ColumnConfig, passOnProps) => {
    if (type.toLowerCase() === WidgetTypes.COMPONENT) {
        const Widget = WidgetsForCustomLayout[name];

        if (!Widget) {
            log.error(errorCreator(`Widget ${name} is not supported`)({ name }));
            return null;
        }

        const { getProps, shouldHideWidget } = Widget;

        const widgetProps = getProps(passOnProps);
        const hideWidget = shouldHideWidget && shouldHideWidget(passOnProps);

        if (hideWidget) return null;

        return withMemo(Widget.Component, widgetProps);
    }

    log.error(errorCreator(`Widget type ${type} is not supported`)({ type, name }));
    return null;
};

export const useCustomColumns = ({
    customPageLayoutConfig,
    allProps,
}: Props) => {
    const {
        leftColumn,
        rightColumn,
    } = customPageLayoutConfig;

    const leftColumnWidgets = useMemo(
        (): ?Array<React$Node> => leftColumn
            ?.map((widget: ColumnConfig) => renderWidget(widget, allProps))
            .filter(component => component),
        [allProps, leftColumn],
    );
    const rightColumnWidgets = useMemo(
        (): ?Array<React$Node> => rightColumn
            ?.map((widget: ColumnConfig) => renderWidget(widget, allProps))
            .filter(component => component),
        [allProps, rightColumn],
    );

    return {
        leftColumnWidgets,
        rightColumnWidgets,
    };
};
