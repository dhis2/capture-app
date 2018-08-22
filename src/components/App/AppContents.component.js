// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router'; //eslint-disable-line
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { withStyles } from '@material-ui/core/styles';

import getD2 from 'capture-core/d2/d2Instance';
import NetworkStatusBadge from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.component';

import MainPageEntry from 'capture-core/components/Pages/MainPage/MainPageEntry/MainPageEntry.container';
import NewEventEntry from 'capture-core/components/Pages/NewEvent/NewEventEntry/NewEventEntry.container';
import EditEventEntry from 'capture-core/components/Pages/EditEvent/EditEventEntry/EditEventEntry.container';

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
                        <Route path="/newEvent" component={NewEventEntry} />
                        <Route path="/editEvent" component={EditEventEntry} />
                        <Route path="/:keys" component={MainPageEntry} />
                        <Route path="/" component={MainPageEntry} />
                    </Switch>
                </div>
                <div />
            </div>
        );
    }
}

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
