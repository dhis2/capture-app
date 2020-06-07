// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router'; //eslint-disable-line
// import HeaderBar from '@dhis2/d2-ui-header-bar';
import { HeaderBar } from '@dhis2/ui-widgets';
import { withStyles } from '@material-ui/core/styles';

import NetworkStatusBadge from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.component';

import { NewEventPage } from 'capture-core/components/Pages/NewEvent';
import { ViewEventPage } from 'capture-core/components/Pages/ViewEvent';
import { NewEnrollmentPage } from 'capture-core/components/Pages/NewEnrollment';
import SearchPage from "../../core_modules/capture-core/components/Pages/Search/Page";
import { MainPage } from 'capture-core/components/Pages/MainPage';


const styles = theme => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
    pageContainer: {
        paddingTop: 48,
    },
    headerBar: {
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
    },
});

type Props = {
    classes: {
        app: string,
        pageContainer: string,
        headerBar: string,
    },
};

class AppContents extends Component<Props> {
    render() {
        const { classes } = this.props;

        return (
            <div
                className={classes.app}
            >
                <HeaderBar
                    appName={'Capture App'}
                    className={classes.headerBar}
                >
                    <NetworkStatusBadge />
                </HeaderBar>
                <div
                    className={classes.pageContainer}
                >
                    <Switch>
                        <Route path="/newEvent" component={NewEventPage} />
                        <Route path="/viewEvent" component={ViewEventPage} />
                        <Route path="/newEnrollment" component={NewEnrollmentPage} />
                        <Route path="/search" component={SearchPage} />
                        <Route path="/:keys" component={MainPage} />
                        <Route path="/" component={MainPage} />
                    </Switch>
                </div>
            </div>
        );
    }
}

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
