// @flow
/**
 * @namespace MainPage
*/
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import QuickSelector from 'capture-core/components/QuickSelector/QuickSelector.container';

import LoadingMask from '../../LoadingMasks/LoadingMask.component';
import EventsList from './EventsList/EventsList.container';

const styles = () => ({
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
});

type Props = {
    prerequisitesForWorkingListMet: boolean,
    selectionsError: ?string,
    isLoading: boolean,
    classes: {
        loaderContainer: string,
    }
};

class MainPage extends Component<Props> {
    render() {
        const { prerequisitesForWorkingListMet, selectionsError, isLoading, classes } = this.props;

        if (isLoading) {
            return (
                <div
                    className={classes.loaderContainer}
                >
                    <LoadingMask />
                </div>
            );
        }

        if (selectionsError) {
            return (
                <div>
                    { selectionsError }
                </div>
            );
        }

        return (
            <div>
                {'{{main menu}}'}

                {
                    (() => {
                        if (!prerequisitesForWorkingListMet) {
                            return null;
                        }

                        return (
                            <EventsList />
                        );
                    })()
                }
            </div>
        );
    }
}

export default withStyles(styles)(MainPage);
