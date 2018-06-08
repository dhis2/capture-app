// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '../../../Buttons/Button.component';
import { getTranslation } from '../../../../d2/d2Instance';

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
            text = getTranslation('select_a_registering_unit_and_program_to_get_started');
        } else if (!isProgramSelected) {
            text = getTranslation('select_a_program_to_start_reporting');
        } else {
            text = getTranslation('select_a_registering_unit_to_start_reporting');
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
                        {getTranslation('save')}
                    </Button>
                    <Button
                        variant="raised"
                        color="secondary"
                        onClick={onCancel}
                    >
                        {getTranslation('cancel')}
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(DataEntrySelectionsIncomplete);
