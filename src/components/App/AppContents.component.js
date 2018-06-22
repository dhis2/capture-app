// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router'; //eslint-disable-line
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { withStyles } from '@material-ui/core/styles';

import getD2 from 'capture-core/d2/d2Instance';
import NetworkStatusBadge from 'capture-core/components/NetworkStatusBadge/NetworkStatusBadge.component';

import MainPageSelector from 'capture-core/components/Pages/MainPage/MainPageSelector/MainPageSelector.container';
import NewEventSelector from 'capture-core/components/Pages/NewEvent/NewEventSelector/NewEventSelector.container';
import EditEventSelector from 'capture-core/components/Pages/EditEvent/EditEventSelector/EditEventSelector.container';
// import EventCaptureForm from '../EventCaptureForm/EventCaptureForm.container';

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
                        <Route path="/newEvent" component={NewEventSelector} />
                        <Route path="/editEvent" component={EditEventSelector} />
                        <Route path="/:keys" component={MainPageSelector} />
                        <Route path="/" component={MainPageSelector} />
                    </Switch>
                </div>
                <div />
            </div>
        );
    }
}

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;

/*  <Route path="/event" component={EventCaptureForm} /> */
