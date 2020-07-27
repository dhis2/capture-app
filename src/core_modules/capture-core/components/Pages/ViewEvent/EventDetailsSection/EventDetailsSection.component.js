// @flow
import React, { Component } from 'react';
import { Info as InfoIcon } from '@material-ui/icons';
import { withStyles, Tooltip } from '@material-ui/core/';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../Buttons/Button.component';
import ViewEventSection from '../Section/ViewEventSection.component';
import ViewEventSectionHeader from '../Section/ViewEventSectionHeader.component';
import EditEventDataEntry from './EditEventDataEntry/EditEventDataEntry.container';
import ViewEventDataEntry from './ViewEventDataEntry/ViewEventDataEntry.container';
import { ProgramStage } from '../../../../metaData';

const getStyles = (theme: Theme) => ({
    container: {
        flexGrow: 2,
        flexBasis: 0,
    },
    content: {
        display: 'flex',
    },
    dataEntryContainer: {
        flexGrow: 1,
        padding: theme.typography.pxToRem(10),
    },
    actionsContainer: {
        minWidth: theme.typography.pxToRem(128),
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(30),
    },
    button: {
        whiteSpace: 'nowrap',
    },
    editButtonContainer: {
        display: 'inline-block',
    },
});

type Props = {
    showEditEvent: ?boolean,
    onOpenEditEvent: () => void,
    programStage: ProgramStage,
    eventAccess: { read: boolean, write: boolean },
    classes: {
        container: string,
        content: string,
        dataEntryContainer: string,
        actionsContainer: string,
        button: string,
        editButtonContainer: string,
    },
};

class EventDetailsSection extends Component<Props> {
    renderDataEntryContainer = () => {
        const {
            classes,
            onOpenEditEvent,
            showEditEvent,
            programStage,
            eventAccess,
            ...passOnProps } = this.props;

        const formFoundation = programStage.stageForm;
        return (
            <div className={classes.dataEntryContainer}>
                {showEditEvent ?
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <EditEventDataEntry
                        formFoundation={formFoundation}
                        {...passOnProps}
                    /> :
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <ViewEventDataEntry
                        formFoundation={formFoundation}
                        {...passOnProps}
                    />
                }
            </div>
        );
    }

    renderActionsContainer = () => {
        const {
            classes,
            onOpenEditEvent,
            showEditEvent,
            eventAccess,
        } = this.props;
        const canEdit = eventAccess.write;
        return (
            <div className={classes.actionsContainer}>
                {!showEditEvent &&
                <Tooltip title={canEdit ? '' : i18n.t('You dont have access to edit this event')}>
                    <div className={classes.editButtonContainer}>
                        <Button
                            className={classes.button}
                            variant="raised"
                            onClick={onOpenEditEvent}
                            disabled={!canEdit}
                        >
                            {i18n.t('Edit event')}
                        </Button>
                    </div>
                </Tooltip>

                }
            </div>
        );
    }

    render() {
        const {
            classes,
        } = this.props;
        return (
            <div className={classes.container}>
                <ViewEventSection
                    header={<ViewEventSectionHeader text="Event details" icon={InfoIcon} />}
                >
                    <div className={classes.content}>
                        {this.renderDataEntryContainer()}
                        {this.renderActionsContainer()}
                    </div>
                </ViewEventSection>
            </div>
        );
    }
}


export default withStyles(getStyles)(EventDetailsSection);
