// @flow
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { withStyles } from 'material-ui-next/styles';

import getD2 from 'capture-core/d2/d2Instance';
import MainPage from 'capture-core/components/Pages/MainPage/MainPage.container';
import QuickSelector from 'capture-core/components/QuickSelector/QuickSelector.container';
import EventCaptureForm from '../EventCaptureForm/EventCaptureForm.container';

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

        const d2 = getD2();

        return (
            <div
                className={classes.app}
            >
                <HeaderBar d2={d2} />
                <div style={{ paddingTop: 48 }}>
                    <QuickSelector />
                </div>
                <div style={{ padding: 25 }}>
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
