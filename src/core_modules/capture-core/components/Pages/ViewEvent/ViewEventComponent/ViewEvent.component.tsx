import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';
import { spacers } from '@dhis2/ui';
import { EventDetails } from '../EventDetailsSection/EventDetailsSection.container';
import { RightColumnWrapper } from '../RightColumn/RightColumnWrapper.component';
import { type ProgramStage } from '../../../../metaData';
import type { UserFormField } from '../../../FormFields/UserField';
import { EventBreadcrumb } from '../../../Breadcrumbs/EventBreadcrumb';
import { pageKeys } from '../../../Breadcrumbs/EventBreadcrumb/EventBreadcrumb';
import { ViewEventReadOnlyBadge } from '../ViewEventReadOnlyBadge';
import { startGoBackToMainPage } from './viewEvent.actions';
import { useLocationQuery } from '../../../../utils/routing';
import {
    useHideWidgetByRuleLocations,
    useEventEditPermissions,
} from '../../../../hooks';

const getStyles = (theme: any) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp12,
        padding: theme.typography.pxToRem(24),
        paddingTop: theme.typography.pxToRem(10),
    },
    dataEntryPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
    header: {
        ...theme.typography.title,
        fontSize: 18,
        padding: theme.typography.pxToRem(10),
        borderBottom: `1px solid ${theme.palette.grey.blueGrey}`,
    },
    breadcrumbRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacers.dp8,
    },
    contentContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacers.dp16,
    },
}) as const;

type Props = {
    programId: string,
    currentDataEntryKey: string,
    programStage: ProgramStage,
    eventAccess: { read: boolean, write: boolean },
    isUserInteractionInProgress: boolean,
    isEditEventPage: boolean,
    onBackToViewEvent: () => void,
    assignee: UserFormField,
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent },
    onSaveAssignee: (newAssignee: UserFormField) => void,
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void,
    feedbackEmptyText: string,
    indicatorEmptyText: string,
    programRules: Array<any>,
};

export const ViewEventPlain = (props: Props & WithStyles<typeof getStyles>) => {
    const {
        classes,
        programId,
        programStage,
        isEditEventPage,
        onBackToViewEvent,
        isUserInteractionInProgress,
        currentDataEntryKey,
        eventAccess,
        assignee,
        getAssignedUserSaveContext,
        onSaveAssignee,
        onSaveAssigneeError,
        feedbackEmptyText,
        indicatorEmptyText,
        programRules,
    } = props;

    const dispatch = useDispatch();
    const { orgUnitId } = useLocationQuery();
    const onBackToAllEvents = useCallback(() => {
        dispatch(startGoBackToMainPage(orgUnitId));
    }, [dispatch, orgUnitId]);

    const hideWidgets = useHideWidgetByRuleLocations(programRules);

    const occurredAt = useSelector((state: any) => state.viewEventPage.loadedValues?.dataEntryValues?.occurredAt);
    const eventStatus = useSelector((state: any) => state.viewEventPage.loadedValues?.eventContainer?.event?.status);
    const completedAt = useSelector((state: any) => state.viewEventPage.loadedValues?.eventContainer?.event?.completedAt);

    const {
        isEventWithinValidPeriod,
        isWithinCompleteExpiry,
        canEditCompletedEvent,
        readOnly,
    } = useEventEditPermissions({
        programId,
        stage: programStage,
        eventStatus,
        occurredAt,
        completedAt,
    });
    const showEditButton = !isEditEventPage && !readOnly;

    return (
        <div className={classes.container}>
            <div className={classes.breadcrumbRow}>
                <EventBreadcrumb
                    programId={programId}
                    page={isEditEventPage ? pageKeys.EDIT_EVENT : pageKeys.VIEW_EVENT}
                    userInteractionInProgress={isUserInteractionInProgress}
                    onBackToViewEvent={onBackToViewEvent}
                    onBackToMainPage={onBackToAllEvents}
                />
                <ViewEventReadOnlyBadge
                    eventAccess={eventAccess}
                    isEventWithinValidPeriod={isEventWithinValidPeriod}
                    canEditCompletedEvent={canEditCompletedEvent}
                    isWithinCompleteEventsExpiry={isWithinCompleteExpiry}
                />
            </div>
            <div className={classes.contentContainer}>
                <EventDetails
                    eventAccess={eventAccess}
                    programStage={programStage}
                    onBackToViewEvent={onBackToViewEvent}
                    onBackToAllEvents={onBackToAllEvents}
                    showEditButton={showEditButton}
                />
                <RightColumnWrapper
                    eventAccess={eventAccess}
                    readOnly={readOnly}
                    programStage={programStage}
                    dataEntryKey={currentDataEntryKey}
                    assignee={assignee}
                    getAssignedUserSaveContext={getAssignedUserSaveContext}
                    onSaveAssignee={onSaveAssignee}
                    onSaveAssigneeError={onSaveAssigneeError}
                    feedbackEmptyText={feedbackEmptyText}
                    indicatorEmptyText={indicatorEmptyText}
                    hideWidgets={hideWidgets}
                />
            </div>
        </div>
    );
};

export const ViewEventComponent = withStyles(getStyles)(ViewEventPlain);
