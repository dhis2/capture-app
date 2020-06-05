// @flow
/**
 * @namespace MainPage
*/
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EventsListConnectivityWrapper from './EventsListConnectivityWrapper/EventsListConnectivityWrapper.container';
import { TrackerProgramHandler } from '../../TrackerProgramHandler';

const getStyles = () => ({
    listContainer: {
        padding: 24,
    },
});

type Props = {
    currentSelectionsComplete: boolean,
    classes: {
        listContainer: string,
    },
};

class MainPage extends Component<Props> {
    render() {
        const { currentSelectionsComplete, classes } = this.props;

        return (
            <div>
                {
                    (() => {
                        if (!currentSelectionsComplete) {
                            return null;
                        }

                        return (
                            <TrackerProgramHandler>
                                <div className={classes.listContainer}>
                                    <EventsListConnectivityWrapper listId={'eventList'} />
                                </div>
                            </TrackerProgramHandler>
                        );
                    })()
                }
            </div>
        );
    }
}

export default withStyles(getStyles)(MainPage);
