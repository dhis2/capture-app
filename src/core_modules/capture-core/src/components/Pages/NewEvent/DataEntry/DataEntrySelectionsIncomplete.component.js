// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '../../../Buttons/Button.component';
import i18n from '@dhis2/d2-i18n';

const getStyles = () => ({
    contents: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    buttonRow: {
        paddingTop: 10,
        marginLeft: '-8px',
    },
});
type Props = {
    isProgramSelected: boolean,
    isOrgUnitSelected: boolean,
    classes: {
        contents: string,
        buttonRow: string,
    },
    onCancel: () => void,
};

class DataEntrySelectionsIncomplete extends Component<Props> {
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
            <div>
                <Paper
                    elevation={0}
                >
                    <div
                        className={classes.contents}
                    >
                        {this.getText()}
                    </div>
                </Paper>
                <div
                    className={classes.buttonRow}
                >
                    <Button
                        variant="raised"
                        color="primary"
                        disabled
                    >
                        {i18n.t('Save')}
                    </Button>
                    <Button
                        variant="raised"
                        color="secondary"
                        onClick={onCancel}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(DataEntrySelectionsIncomplete);
