import React from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import { EventDetails } from '../EventDetailsSection/EventDetailsSection.container';
import { RightColumnWrapper } from '../RightColumn/RightColumnWrapper.component';
import type { ProgramStage } from '../../../../metaData';
import type { UserFormField } from '../../../FormFields/UserField';
import type { ApiEnrollmentEvent } from '../../../../../capture-core-utils/types/api-types';
import { EventBreadcrumb } from '../../../Breadcrumbs/EventBreadcrumb';
import { pageKeys } from '../../../Breadcrumbs/EventBreadcrumb/EventBreadcrumb';
import { startGoBackToMainPage } from './viewEvent.actions';
import { useLocationQuery } from '../../../../utils/routing';

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
    showEditEvent: boolean,
    onBackToViewEvent: () => void,
    assignee: UserFormField,
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent },
    onSaveAssignee: (newAssignee: UserFormField) => void,
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void,
};

export const ViewEventPlain = (props: Props & WithStyles<typeof getStyles>) => {
    const {
        classes,
        programId,
        programStage,
        showEditEvent,
        onBackToViewEvent,
        isUserInteractionInProgress,
        currentDataEntryKey,
        eventAccess,
        assignee,
        getAssignedUserSaveContext,
        onSaveAssignee,
        onSaveAssigneeError,
    } = props;

    const dispatch = useDispatch();
    const { orgUnitId } = useLocationQuery();
    const onBackToAllEvents = () => {
        dispatch(startGoBackToMainPage(orgUnitId));
    };

    return (
        <div className={classes.container}>
            <EventBreadcrumb
                programId={programId}
                page={showEditEvent ? pageKeys.EDIT_EVENT : pageKeys.VIEW_EVENT}
                userInteractionInProgress={isUserInteractionInProgress}
                onBackToViewEvent={onBackToViewEvent}
                onBackToMainPage={onBackToAllEvents}
            />
            <div className={classes.contentContainer}>
            <EventDetails
                    eventAccess={eventAccess}
                    programStage={programStage}
                    onBackToViewEvent={onBackToViewEvent}
                    onBackToAllEvents={onBackToAllEvents}
                />
                <RightColumnWrapper
                    eventAccess={eventAccess}
                    programStage={programStage}
                    dataEntryKey={currentDataEntryKey}
                    assignee={assignee}
                    getAssignedUserSaveContext={getAssignedUserSaveContext}
                    onSaveAssignee={onSaveAssignee}
                    onSaveAssigneeError={onSaveAssigneeError}
                />
            </div>
        </div>
    );
};

export const ViewEventComponent = withStyles(getStyles)(ViewEventPlain);
