// @flow
import React, { Component } from 'react';

import HeaderBar from '@dhis2/d2-ui-header-bar';

import { withStyles } from 'material-ui-next/styles';
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

        return (
            <div
                className={classes.app}
            >
                <div>
                    <HeaderBar d2={this.context.d2} />
                </div>
                <div style={{ padding: 100 }}>
                    <EventCaptureForm />
                </div>
                <div />
            </div>
        );
    }
}

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
