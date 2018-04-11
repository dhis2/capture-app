// @flow
import React, { Component } from 'react';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import { Route, Switch } from 'react-router';

import { withStyles } from 'material-ui-next/styles';

import MainPage from 'capture-core/components/Pages/MainPage/MainPage.component';
import EventCaptureForm from '../EventCaptureForm/EventCaptureForm.container';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const styles = theme => ({
    app: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.pxToRem(16),
    },
});

type Props = {
    classes: Object
};

class AppContents extends Component<Props> {
    render() {
        const { classes } = this.props;

        return (
            <div
                className={classes.app}
            >
                <div>
                    <HeaderBar />
                </div>
                <div style={{ padding: 100 }}>
                    <Switch>
                        <Route path="/event" component={EventCaptureForm} />
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

export default AppContentsWithStyles;
