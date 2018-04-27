// @flow
import React, { Component } from 'react';

import HeaderBar from '@dhis2/d2-ui-header-bar';
import DownloadTable from 'capture-core/components/DownloadTable/DownloadTable.component';


import { withStyles } from 'material-ui-next/styles';
import EventCaptureForm from '../EventCaptureForm/EventCaptureForm.container';
import getD2 from 'capture-core/d2/d2Instance';

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
            <div className={classes.app}>
                <HeaderBar d2={d2} />

                <div style={{ padding: 100 }}>
                    <DownloadTable />
                    <EventCaptureForm />
                </div>
                <div />
            </div>
        );
    }
}

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
