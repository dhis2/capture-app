// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import EditEventDataEntry from './DataEntry/EditEventDataEntry.container';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
    },
    dataEntryPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
    header: {
        ...theme.typography.title,
        fontSize: 16,
        fontWeight: 500,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
    },
});

type Props = {
    classes: {
        container: string,
        dataEntryPaper: string,
        header: string,
    },
};

class EditEvent extends Component<Props> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <Paper
                    className={classes.dataEntryPaper}
                >
                    <div className={classes.header}>
                        {i18n.t('Edit event')}
                    </div>
                    <EditEventDataEntry />
                </Paper>
            </div>

        );
    }
}

export default withStyles(getStyles)(EditEvent);
