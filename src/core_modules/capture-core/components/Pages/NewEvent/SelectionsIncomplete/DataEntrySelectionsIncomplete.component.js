// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';
import { Button } from '@dhis2/ui';

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
    // $FlowFixMe[cannot-spread-inexact] automated comment
    header: {
        flexGrow: 1,
        ...theme.typography.title,
        fontSize: 16,
        fontWeight: 500,
    },
});
type Props = {
    isProgramSelected: boolean,
    isOrgUnitSelected: boolean,
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

class DataEntrySelectionsIncomplete extends Component<Props> {
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
    getText() {
        let text;
        const { isProgramSelected, isOrgUnitSelected } = this.props;

        if (!isProgramSelected && !isOrgUnitSelected) {
            text = i18n.t('Select a registering unit and program above to get started');
        } else if (!isProgramSelected) {
            text = i18n.t('Select a program to start reporting');
        } else if (!isOrgUnitSelected) {
            text = i18n.t('Select a registering unit to start reporting');
        } else {
            text = i18n.t('Select a category option to start reporting');
        }

        return text;
    }
    render() {
        const { classes, onCancel } = this.props;
        return (
            <div className={classes.container}>
                {this.renderHeader()}
                <Paper
                    elevation={0}
                    data-test="dhis2-capture-paper"
                >
                    <div
                        data-test="dhis2-capture-paper-text"
                        className={classes.contents}
                    >
                        {this.getText()}
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
                            dataTest="dhis2-capture-new-page-cancel-button"
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

export default withStyles(getStyles)(DataEntrySelectionsIncomplete);
