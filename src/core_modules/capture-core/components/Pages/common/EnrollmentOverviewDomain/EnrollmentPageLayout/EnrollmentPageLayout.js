// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { useWidgetColumns } from './hooks/useWidgetColumns';
import { AddRelationshipRefWrapper } from './AddRelationshipRefWrapper';
import type { PlainProps } from '../../../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';
import { EnrollmentBreadcrumb } from '../../../../Breadcrumbs/EnrollmentBreadcrumb';

const getEnrollmentPageStyles = () => ({
    container: {
        minHeight: '90vh',
        padding: '16px 24px 16px 24px',
    },
    contentContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp12,
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
    },
});

// Function to validate hex color
const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

const EnrollmentPageLayoutPlain = ({
    pageLayout,
    availableWidgets,
    program,
    trackedEntityName,
    userInteractionInProgress,
    eventStatus,
    currentPage,
    onBackToMainPage,
    onBackToDashboard,
    onBackToViewEvent,
    classes,
    ...passOnProps
}: PlainProps) => {
    const [mainContentVisible, setMainContentVisibility] = useState(true);
    const [addRelationShipContainerElement, setAddRelationshipContainerElement] =
        useState<HTMLDivElement | void>(undefined);
    const toggleVisibility = useCallback(() => setMainContentVisibility(current => !current), []);

    const allProps = useMemo(() => ({
        ...passOnProps,
        program,
        currentPage,
        eventStatus,
        toggleVisibility,
        addRelationShipContainerElement,
    }), [
        addRelationShipContainerElement,
        currentPage,
        eventStatus,
        passOnProps,
        program,
        toggleVisibility,
    ]);

    const {
        leftColumnWidgets,
        rightColumnWidgets,
    } = useWidgetColumns({
        pageLayout,
        availableWidgets,
        props: allProps,
    });

    const containerStyle = useMemo(() => {
        if (!pageLayout.backgroundColor || !isValidHex(pageLayout.backgroundColor)) return undefined;
        return { backgroundColor: pageLayout.backgroundColor };
    }, [pageLayout.backgroundColor]);

    return (
        <div
            className={classes.container}
            style={containerStyle}
            data-test={`enrollment-${currentPage}-page`}
        >
            <AddRelationshipRefWrapper setRelationshipRef={setAddRelationshipContainerElement} />
            <div
                className={classes.contentContainer}
                style={!mainContentVisible ? { display: 'none' } : undefined}
            >
                <div>
                    <EnrollmentBreadcrumb
                        page={currentPage}
                        onBackToMainPage={onBackToMainPage}
                        onBackToDashboard={onBackToDashboard}
                        onBackToViewEvent={onBackToViewEvent}
                        programId={program.id}
                        trackedEntityName={trackedEntityName}
                        displayFrontPageList={program.displayFrontPageList}
                        userInteractionInProgress={userInteractionInProgress}
                        eventStatus={eventStatus}
                    />
                </div>
                <div className={classes.columns}>
                    {pageLayout.leftColumn && !!leftColumnWidgets?.length && (
                        <div className={classes.leftColumn}>
                            {leftColumnWidgets}
                        </div>
                    )}
                    {pageLayout.rightColumn && !!rightColumnWidgets?.length && (
                        <div className={classes.rightColumn}>
                            {rightColumnWidgets}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const EnrollmentPageLayout = withStyles(
    getEnrollmentPageStyles,
)(EnrollmentPageLayoutPlain);
