// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import EventDetails from '../EventDetailsSection/EventDetailsSection.container';
import Button from '../../../Buttons/Button.component';
import type { ProgramStage } from '../../../../metaData';
import { DataEntryWidgetOutput } from '../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { editEventIds } from '../../EditEvent/DataEntry/editEventDataEntry.actions';

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
        paddingLeft: 8,
        marginTop: 4,
        textTransform: 'none',
        backgroundColor: '#E9EEF4',
        boxShadow: 'none',
        color: '#494949',
        fontSize: 14,
        fontWeight: 'normal',
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
    },
});

type Props = {
    onBackToAllEvents: () => void,
    ready: boolean,
    currentProgramId: string,
    programStage: ProgramStage,
    eventAccess: { read: boolean, write: boolean },
    classes: {
        container: string,
        contentContainer: string,
        dataEntryPaper: string,
        header: string,
        showAllEvents: string,
    },
};


class ViewEvent extends Component<Props> {
    handleGoBackToAllEvents = () => {
        this.props.onBackToAllEvents();
    }

    render() {
        const { classes, programStage, eventAccess, currentProgramId, ready } = this.props;
        return (
            <div className={classes.container}>
                <Button className={classes.showAllEvents} variant="raised" onClick={this.handleGoBackToAllEvents}>
                    <ChevronLeft />
                    {i18n.t('Show all eventsasdasd')}
                </Button>
                <Grid container>
                    <Grid item md={7} sm={7} xs={12} >
                        <EventDetails
                            eventAccess={eventAccess}
                            programStage={programStage}
                        />
                    </Grid>

                    <Grid item md={3} sm={3} xs={12} >
                        <DataEntryWidgetOutput
                            ready={ready}
                            eventAccess={eventAccess}
                            dataEntryId={editEventIds.dataEntryId}
                            selectedScopeId={currentProgramId}
                        />
                    </Grid>
                </Grid>
            </div>

        );
    }
}

export default withStyles(getStyles)(ViewEvent);
