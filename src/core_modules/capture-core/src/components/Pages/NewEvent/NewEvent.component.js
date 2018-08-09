// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DataEntryWrapper from './DataEntry/DataEntryWrapper.container';
import EventsList from './RecentlyAddedEventsList/RecentlyAddedEventsList.container';

const getStyles = () => ({
    dataEntryContainer: {
        padding: 24,
    },
    newEventsListContainer: {
        padding: 24,
    },
});

type Props = {
    classes: {
        dataEntryContainer: string,
        newEventsListContainer: string,
    },
};

class NewEvent extends Component<Props> {
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div
                    className={classes.dataEntryContainer}
                >
                    <DataEntryWrapper />
                </div>
                <div className={classes.newEventsListContainer}>
                    <EventsList />
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(NewEvent);
