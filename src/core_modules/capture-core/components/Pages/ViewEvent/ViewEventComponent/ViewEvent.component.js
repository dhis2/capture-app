// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import EventDetails from '../EventDetailsSection/EventDetailsSection.container';
import Button from '../../../Buttons/Button.component';
import RightColumnWrapper from '../RightColumn/RightColumnWrapper.component';
import { ProgramStage } from '../../../../metaData';


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
        marginBottom: 10,
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
    currentDataEntryKey: string,
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
        const { classes, programStage, currentDataEntryKey, eventAccess } = this.props;
        return (
            <div className={classes.container}>
                <Button className={classes.showAllEvents} variant="raised" onClick={this.handleGoBackToAllEvents}>
                    <ChevronLeft />
                    {i18n.t('Show all events')}
                </Button>
                <div className={classes.contentContainer}>
                    <EventDetails
                        eventAccess={eventAccess}
                        programStage={programStage}
                    />
                    <RightColumnWrapper
                        eventAccess={eventAccess}
                        programStage={programStage}
                        dataEntryKey={currentDataEntryKey}
                    />
                </div>

            </div>

        );
    }
}

export default withStyles(getStyles)(ViewEvent);
