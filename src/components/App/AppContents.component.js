// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router'; //eslint-disable-line
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { withStyles } from '@material-ui/core/styles';

import getD2 from 'capture-core/d2/d2Instance';
import NetworkStatusBadge from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.component';

import { NewEventPage } from 'capture-core/components/Pages/NewEvent';
import { NewEnrollmentPage } from 'capture-core/components/Pages/NewEnrollment';
import MainPageEntry from 'capture-core/components/Pages/MainPage/MainPageEntry/MainPageEntry.container';
import EditEventEntry from 'capture-core/components/Pages/EditEvent/EditEventEntry/EditEventEntry.container';
import ViewEventEntry from 'capture-core/components/Pages/ViewEvent/ViewEventEntry/ViewEventEntry.container';

const styles = theme => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
    pageContainer: {
        paddingTop: 48,
    },
});

type Props = {
    classes: {
        app: string,
        pageContainer: string,
    },
};

class AppContents extends Component<Props> {
    render() {
        const { classes } = this.props;

        const d2 = getD2();

        return (
            <div
                className={classes.app}
            >
                <HeaderBar d2={d2}>
                    <NetworkStatusBadge />
                </HeaderBar>
                <div
                    className={classes.pageContainer}
                >
                    <Switch>
                        <Route path="/newEvent" component={NewEventPage} />
                        <Route path="/editEvent" component={EditEventEntry} />
                        <Route path="/viewEvent" component={ViewEventEntry} />
                        <Route path="/newEnrollment" component={NewEnrollmentPage} />
                        <Route path="/:keys" component={MainPageEntry} />
                        <Route path="/" component={MainPageEntry} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
