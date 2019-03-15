// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';
import Button from '../../../Buttons/Button.component';

const getStyles = (theme: Theme) => ({
    container: {
        padding: 24,
    },
    contents: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    buttonRow: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: 10,
        marginLeft: '-8px',
    },
    buttonContainer: {
        paddingRight: theme.spacing.unit * 2,
    },
    headerContainer: {
        paddingTop: 9,
        paddingBottom: 20,
    },
    header: {
        flexGrow: 1,
        ...theme.typography.title,
        fontSize: 16,
        fontWeight: 500,
    },
});
type Props = {
    classes: {
        container: string,
        contents: string,
        buttonRow: string,
        buttonContainer: string,
        headerContainer: string,
        header: string,
    },
    onCancel: () => void,
};

class DataEntrySelectionsNoAccess extends Component<Props> {
    renderHeader() {
        return (
            <div
                className={this.props.classes.headerContainer}
            >
                <div
                    className={this.props.classes.header}
                >
                    {i18n.t('New event')}
                </div>
            </div>
        );
    }
    render() {
        const { classes, onCancel } = this.props;
        return (
            <div className={classes.container}>
                {this.renderHeader()}
                <Paper
                    elevation={0}
                >
                    <div
                        className={classes.contents}
                    >
                        {i18n.t('You dont have access to create a new program in the current selections')}
                    </div>
                </Paper>
                <div
                    className={classes.buttonRow}
                >
                    <div
                        className={classes.buttonContainer}
                    >
                        <Button
                            variant="raised"
                            color="primary"
                            disabled
                        >
                            {i18n.t('Save')}
                        </Button>
                    </div>
                    <div
                        className={classes.buttonContainer}
                    >
                        <Button
                            variant="text"
                            color="primary"
                            onClick={onCancel}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(DataEntrySelectionsNoAccess);
