// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { spacers, IconChevronLeft24, Button } from '@dhis2/ui';
import { EventDetails } from '../EventDetailsSection/EventDetailsSection.container';
import { RightColumnWrapper } from '../RightColumn/RightColumnWrapper.component';
import type { ProgramStage } from '../../../../metaData';
import { DiscardDialog } from '../../../Dialogs/DiscardDialog.component';
import { defaultDialogProps } from '../../../Dialogs/DiscardDialog.constants';
import type { UserFormField } from '../../../FormFields/UserField';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
        paddingTop: theme.typography.pxToRem(10),
    },
    dataEntryPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
    showAllEvents: {
        marginBottom: spacers.dp12,
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
});

type Props = {
    onBackToAllEvents: () => void,
    currentDataEntryKey: string,
    programStage: ProgramStage,
    eventAccess: { read: boolean, write: boolean },
    isUserInteractionInProgress: boolean,
    classes: {
        container: string,
        contentContainer: string,
        dataEntryPaper: string,
        header: string,
        showAllEvents: string,
    },
    assignee: UserFormField,
    getAssignedUserSaveContext: () => { event: ApiEnrollmentEvent },
    onSaveAssignee: (newAssignee: UserFormField) => void,
    onSaveAssigneeError: (prevAssignee: UserFormField | null) => void,
};

type State = {
    warningOpen: boolean
}
class ViewEventPlain extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            warningOpen: false,
        };
    }
    handleGoBackToAllEvents = () => {
        const { isUserInteractionInProgress, onBackToAllEvents } = this.props;
        if (!isUserInteractionInProgress) {
            onBackToAllEvents();
        } else {
            this.setState({ warningOpen: true });
        }
    }

    render() {
        const {
            classes,
            programStage,
            currentDataEntryKey,
            eventAccess,
            assignee,
            getAssignedUserSaveContext,
            onSaveAssignee,
            onSaveAssigneeError,
            onBackToAllEvents,
        } = this.props;

        return (
            <div className={classes.container}>
                <Button
                    className={classes.showAllEvents}
                    onClick={this.handleGoBackToAllEvents}
                    icon={<IconChevronLeft24 />}
                >
                    {i18n.t('Show all events')}
                </Button>
                <div className={classes.contentContainer}>
                    <EventDetails
                        eventAccess={eventAccess}
                        programStage={programStage}
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
                <DiscardDialog
                    {...defaultDialogProps}
                    onCancel={() => { this.setState({ warningOpen: false }); }}
                    onDestroy={() => this.props.onBackToAllEvents()}
                    open={this.state.warningOpen}
                />
            </div>

        );
    }
}

export const ViewEventComponent = withStyles(getStyles)(ViewEventPlain);
