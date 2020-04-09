// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import EditEventDataEntry from './DataEntry/EditEventDataEntry.container';
import Button from '../../Buttons/Button.component';
import CancelButton from '../../DataEntry/CancelButton.component';

const getStyles = (theme: Theme) => ({
    container: {
        padding: theme.typography.pxToRem(24),
        paddingTop: theme.typography.pxToRem(10),
    },
    dataEntryPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
    header: {
        ...theme.typography.title,
        fontSize: 18,
        fontWeight: 500,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
    },
    showAllEvents: {
        paddingLeft: 8,
        marginBottom: 10,
        textTransform: 'none',
        backgroundColor: '#E9EEF4',
        boxShadow: 'none',
        color: '#494949',
        fontSize: 14,
        fontWeight: 'normal',
    },
});

type Props = {
    classes: {
        container: string,
        dataEntryPaper: string,
        header: string,
        showAllEvents: string,
    },
};

type State = {
    discardWarningOpen: boolean,
}

class EditEvent extends Component<Props, State> {
    cancelButtonInstance: ?CancelButton;
    constructor(props: Props) {
        super(props);
        this.state = { discardWarningOpen: false };
    }

    handleGoBackToAllEvents = () => {
        this.cancelButtonInstance && this.cancelButtonInstance.handleCancel();
    }

    setCancelButtonInstance = (cancelButtonInstance: ?CancelButton) => {
        this.cancelButtonInstance = cancelButtonInstance;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <Button className={classes.showAllEvents} variant="raised" onClick={this.handleGoBackToAllEvents}>
                    <ChevronLeft />
                    {i18n.t('Show all events')}
                </Button>
                <Paper
                    className={classes.dataEntryPaper}
                >
                    <div className={classes.header}>
                        {i18n.t('Edit event')}
                    </div>
                    <EditEventDataEntry
                        cancelButtonRef={this.setCancelButtonInstance}
                    />
                </Paper>
            </div>

        );
    }
}

export default withStyles(getStyles)(EditEvent);
