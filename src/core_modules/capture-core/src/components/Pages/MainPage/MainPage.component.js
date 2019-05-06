// @flow
/**
 * @namespace MainPage
*/
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EventsListConnectivityWrapper from './EventsListConnectivityWrapper/EventsListConnectivityWrapper.container';

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
                            <div
                                className={classes.listContainer}
                            >
                                <EventsListConnectivityWrapper />
                            </div>
                        );
                    })()
                }
            </div>
        );
    }
}

export default withStyles(getStyles)(MainPage);
