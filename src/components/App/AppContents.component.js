// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router'; //eslint-disable-line
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { withStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

import getD2 from 'capture-core/d2/d2Instance';
import MainPage from 'capture-core/components/Pages/MainPage/MainPage.container';
import NewEvent from 'capture-core/components/Pages/NewEvent/NewEvent.container';
import EditEvent from 'capture-core/components/Pages/EditEvent/EditEvent.container';

// import EventCaptureForm from '../EventCaptureForm/EventCaptureForm.container';

const styles = theme => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
});

type Props = {
    classes: Object
};

const mapStateToProps = (state: ReduxState) => ({
    offline: state.offline
});

class AppContents extends Component<Props> {
    render() {

        console.log('AppCompProps', this.props);
        const { classes, offline } = this.props;

        console.log('offlien obj', offline.online);
        const d2 = getD2();

        return (
            <div
                className={classes.app}
            >
                <HeaderBar d2={d2}>
                    <p>Online: {offline.online ? 'yes' : 'no' }</p>
                </HeaderBar>
                <div style={{ padding: 100 }}>
                    <Switch>
                        <Route path="/newEvent" component={NewEvent} />
                        <Route path="/editEvent" component={EditEvent} />
                        <Route path="/:keys" component={MainPage} />
                        <Route path="/" component={MainPage} />
                    </Switch>
                </div>
                <div />
            </div>
        );
    }
}

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default connect(mapStateToProps)(AppContentsWithStyles);

/*  <Route path="/event" component={EventCaptureForm} /> */
