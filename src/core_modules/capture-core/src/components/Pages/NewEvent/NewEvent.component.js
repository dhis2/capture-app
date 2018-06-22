// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DataEntryWrapper from './DataEntry/DataEntryWrapper.container';

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

class NewEvent extends Component<Props> {
    render() {
        const { classes } = this.props;
        return (
            <div
                className={classes.dataEntryContainer}
            >
                <DataEntryWrapper />
            </div>
        );
    }
}

export default withStyles(getStyles)(NewEvent);
