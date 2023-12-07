// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import type { Props } from './CustomEnrollmentPageLayout.types';
import { WidgetsForCustomLayout } from './CustomEnrollmentPageLayout.constants';
import { getEnrollmentPageDefaultStyles } from '../EnrollmentPageDefault.component';
import { AddRelationshipRefWrapper } from '../../../EnrollmentEditEvent/AddRelationshipRefWrapper';

const renderWidget = (component, passOnProps) => {
    const Widget = WidgetsForCustomLayout[component];

    if (!Widget) return null;
    const { getProps, shouldHideWidget } = Widget;

    const widgetProps = getProps(passOnProps);
    const hideWidget = shouldHideWidget && shouldHideWidget(passOnProps);

    if (hideWidget) return null;

    return (
        <Widget.Component
            {...widgetProps}
            key={component}
        />
    );
};

export const CustomEnrollmentPageLayoutPlain = ({
    customPageLayoutConfig,
    classes,
    ...passOnProps
}: Props) => {
    const [mainContentVisible, setMainContentVisibility] = useState(true);
    const [addRelationShipContainerElement, setAddRelationshipContainerElement] =
        useState<HTMLDivElement | void>(undefined);
    const toggleVisibility = useCallback(() => setMainContentVisibility(current => !current), []);

    const allProps = useMemo(() => ({
        ...passOnProps,
        addRelationShipContainerElement,
        toggleVisibility,
    }), [addRelationShipContainerElement, passOnProps, toggleVisibility]);

    const { leftColumn, rightColumn } = customPageLayoutConfig;
    const leftColumnWidgets = useMemo(
        () => leftColumn.map(({ component }) => renderWidget(component, allProps)), [allProps, leftColumn],
    );
    const rightColumnWidgets = useMemo(
        () => rightColumn.map(({ component }) => renderWidget(component, allProps)), [allProps, rightColumn],
    );

    return (
        <>
            <AddRelationshipRefWrapper setRelationshipRef={setAddRelationshipContainerElement} />
            <div
                className={classes.container}
                style={!mainContentVisible ? { display: 'none' } : undefined}
            >
                <div className={classes.title}>{i18n.t('Enrollment Dashboard')}</div>
                <div className={classes.columns}>
                    <div className={classes.leftColumn}>
                        {leftColumnWidgets}
                    </div>
                    <div className={classes.rightColumn}>
                        {rightColumnWidgets}
                    </div>
                </div>
            </div>
        </>
    );
};

export const CustomEnrollmentPageLayout = withStyles(
    getEnrollmentPageDefaultStyles,
)(CustomEnrollmentPageLayoutPlain);
