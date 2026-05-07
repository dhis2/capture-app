import React, { useCallback, useMemo, useState } from 'react';
import { colors, spacers, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { useWidgetColumns } from './hooks/useWidgetColumns';
import { AddRelationshipRefWrapper } from './AddRelationshipRefWrapper';
import type { Props as EnrollmentPageProps } from '../../../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';
import { EnrollmentBreadcrumb } from '../../../../Breadcrumbs/EnrollmentBreadcrumb';
import { ReadOnlyBadge } from '../../../../ReadOnlyBadge';
import { useProgram } from '../../../../WidgetEnrollment/hooks/useProgram';
import './enrollmentPageLayout.css';

const getEnrollmentPageStyles: Readonly<any> = () => ({
    container: {
        minHeight: '90vh',
        padding: spacersNum.dp16,
    },
    contentContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp12,
    },
    columns: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
        containerType: 'inline-size',
    },
    leftColumn: {
        flexGrow: 10,
        flexShrink: 1,
        flexBasis: 700,
        minWidth: 700,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp12,
    },
    rightColumn: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 300,
        minWidth: 300,
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp12,
    },
    title: {
        fontSize: '1.25rem',
        color: colors.grey900,
        fontWeight: 500,
        paddingTop: spacersNum.dp8,
    },
    breadcrumbRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    readOnlyBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: spacersNum.dp4,
        flexShrink: 0,
    },
});

const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color);

const resolveStageBadgeAccess = (
    onEventPage: boolean,
    currentStageWriteAccess: boolean,
    programStageWriteAccess: boolean,
    programStageReadAccess: boolean,
) => (onEventPage
    ? currentStageWriteAccess
    : programStageWriteAccess || !programStageReadAccess);

type BreadcrumbBadgeProgram = {
    programStages?: Array<unknown>;
    trackedEntityType?: { name?: string };
};

type BreadcrumbBadgeProps = {
    onEventPage: boolean;
    currentStageWriteAccess: boolean;
    programWriteAccess: boolean;
    trackedEntityTypeWriteAccess: boolean;
    programStageWriteAccess: boolean;
    programStageReadAccess: boolean;
    program: BreadcrumbBadgeProgram;
};

const BreadcrumbBadge = ({
    onEventPage,
    currentStageWriteAccess,
    programWriteAccess,
    trackedEntityTypeWriteAccess,
    programStageWriteAccess,
    programStageReadAccess,
    program,
}: BreadcrumbBadgeProps) => (
    <ReadOnlyBadge
        readOnly={onEventPage && !currentStageWriteAccess}
        programWriteAccess={onEventPage ? true : programWriteAccess}
        trackedEntityTypeWriteAccess={onEventPage ? true : trackedEntityTypeWriteAccess}
        programStageWriteAccess={resolveStageBadgeAccess(
            onEventPage,
            currentStageWriteAccess,
            programStageWriteAccess,
            programStageReadAccess,
        )}
        multipleStages={!onEventPage && (program?.programStages?.length ?? 0) > 1}
        trackedEntityName={program?.trackedEntityType?.name}
        inlineLabel
    />
);

type OwnProps = EnrollmentPageProps;
type Props = OwnProps & WithStyles<typeof getEnrollmentPageStyles>;

const useStageAccess = (
    programId: string,
    currentStageId: string | undefined,
) => {
    const { program: liveProgram } = useProgram(programId);
    const liveCurrentStage = currentStageId
        ? liveProgram?.programStages?.find((s: any) => s.id === currentStageId)
        : undefined;
    const currentStageWriteAccess = liveCurrentStage
        ? Boolean(liveCurrentStage?.access?.data?.write)
        : true;
    return { currentStageWriteAccess };
};

const EnrollmentPageLayoutPlain = ({
    pageLayout,
    availableWidgets,
    program,
    userInteractionInProgress,
    eventStatus,
    currentPage,
    onBackToMainPage,
    onBackToDashboard,
    onBackToViewEvent,
    programWriteAccess,
    trackedEntityTypeWriteAccess,
    programStageWriteAccess,
    programStageReadAccess,
    classes,
    ...passOnProps
}: Props) => {
    const [mainContentVisible, setMainContentVisibility] = useState(true);
    const [addRelationShipContainerElement, setAddRelationshipContainerElement] =
        useState<HTMLDivElement | undefined>(undefined);
    const toggleVisibility = useCallback(() => setMainContentVisibility(current => !current), []);

    const currentStageId = (passOnProps as any).stageId as string | undefined;
    const { currentStageWriteAccess } = useStageAccess(program.id, currentStageId);
    const onEventPage = Boolean(currentStageId);
    const allWriteAccessMissing = !programWriteAccess
        && !trackedEntityTypeWriteAccess
        && !programStageWriteAccess;
    const hideWidgetReadOnlyBadge = onEventPage || allWriteAccessMissing;

    const allProps = useMemo(() => ({
        ...passOnProps,
        program,
        currentPage,
        eventStatus,
        toggleVisibility,
        addRelationShipContainerElement,
        programWriteAccess,
        trackedEntityTypeWriteAccess,
        programStageWriteAccess,
        programStageReadAccess,
        hideEventStageBadge: hideWidgetReadOnlyBadge,
    }), [
        addRelationShipContainerElement,
        currentPage,
        eventStatus,
        passOnProps,
        program,
        programWriteAccess,
        trackedEntityTypeWriteAccess,
        programStageWriteAccess,
        programStageReadAccess,
        hideWidgetReadOnlyBadge,
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
                <div className={classes.breadcrumbRow}>
                    <EnrollmentBreadcrumb
                        page={currentPage}
                        onBackToMainPage={onBackToMainPage}
                        onBackToDashboard={onBackToDashboard}
                        onBackToViewEvent={onBackToViewEvent}
                        programId={program.id}
                        displayFrontPageList={program.displayFrontPageList}
                        userInteractionInProgress={userInteractionInProgress}
                        eventStatus={eventStatus}
                    />
                    <BreadcrumbBadge
                        onEventPage={onEventPage}
                        currentStageWriteAccess={currentStageWriteAccess}
                        programWriteAccess={programWriteAccess}
                        trackedEntityTypeWriteAccess={trackedEntityTypeWriteAccess}
                        programStageWriteAccess={programStageWriteAccess}
                        programStageReadAccess={programStageReadAccess}
                        program={program as BreadcrumbBadgeProgram}
                    />
                </div>
                <div className={classes.columns}>
                    {pageLayout.leftColumn && !!leftColumnWidgets?.length && (
                        <div id="left-column-enrollment-page-layout" className={classes.leftColumn}>
                            {leftColumnWidgets}
                        </div>
                    )}
                    {pageLayout.rightColumn && !!rightColumnWidgets?.length && (
                        <div id="right-column-enrollment-page-layout" className={classes.rightColumn}>
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
