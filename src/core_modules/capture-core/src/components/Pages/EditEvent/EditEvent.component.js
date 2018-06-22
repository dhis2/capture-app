// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EditEventDataEntry from './DataEntry/EditEventDataEntry.container';

const getStyles = () => ({
    dataEntryContainer: {
        padding: 24,
    },
});

type Props = {
    classes: {
        dataEntryContainer: string,
    },
};

class EditEvent extends Component<Props> {
    render() {
        const { classes } = this.props;
        return (
            <div
                className={classes.dataEntryContainer}
            >
                <EditEventDataEntry />
            </div>
        );
    }
}

export default withStyles(getStyles)(EditEvent);
