// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { useWidgetColumns } from '../../common/EnrollmentOverviewDomain/EnrollmentPageLayout/hooks/useWidgetColumns';
import { AddRelationshipRefWrapper } from '../../EnrollmentEditEvent/AddRelationshipRefWrapper';
import type { PlainProps } from './EnrollmentPageDefault.types';
import { WidgetsForEnrollmentPageDefault } from './DefaultPageLayout';

const getEnrollmentPageDefaultStyles = () => ({
    container: {
        position: 'relative',
    },
    columns: {
        display: 'flex',
        gap: spacers.dp16,
    },
    leftColumn: {
        flexGrow: 3,
        flexShrink: 1,
        width: 872,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
    },
    rightColumn: {
        flexGrow: 1,
        flexShrink: 1,
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
    },
    title: {
        fontSize: '1.25rem',
        color: colors.grey900,
        fontWeight: 500,
        paddingTop: spacersNum.dp8,
        paddingBottom: spacersNum.dp16,
    },
});

export const EnrollmentPageDefaultPlain = ({
    pageLayout,
    classes,
    ...passOnProps
}: PlainProps) => {
    const [mainContentVisible, setMainContentVisibility] = useState(true);
    const [addRelationShipContainerElement, setAddRelationshipContainerElement] =
        useState<HTMLDivElement | void>(undefined);
    const toggleVisibility = useCallback(() => setMainContentVisibility(current => !current), []);

    const allProps = useMemo(() => ({
        ...passOnProps,
        toggleVisibility,
        addRelationShipContainerElement,
    }), [addRelationShipContainerElement, passOnProps, toggleVisibility]);

    const {
        leftColumnWidgets,
        rightColumnWidgets,
    } = useWidgetColumns({
        pageLayout,
        availableWidgets: WidgetsForEnrollmentPageDefault,
        props: allProps,
    });

    return (
        <>
            <AddRelationshipRefWrapper setRelationshipRef={setAddRelationshipContainerElement} />
            <div
                className={classes.container}
                style={!mainContentVisible ? { display: 'none' } : undefined}
            >
                <div className={classes.title}>{pageLayout.title}</div>
                <div className={classes.columns}>
                    {pageLayout.leftColumn && (
                        <div className={classes.leftColumn}>
                            {leftColumnWidgets}
                        </div>
                    )}
                    {pageLayout.rightColumn && (
                        <div className={classes.rightColumn}>
                            {rightColumnWidgets}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export const EnrollmentPageDefaultComponent = withStyles(
    getEnrollmentPageDefaultStyles,
)(EnrollmentPageDefaultPlain);
