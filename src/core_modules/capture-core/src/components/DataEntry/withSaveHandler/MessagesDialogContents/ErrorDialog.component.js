// @flow
import * as React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../Buttons/Button.component';

type Props = {
    errors: Array<{key: string, name: ?string, error: string }>,
    onSave: () => void,
    onAbort: () => void,
    saveEnabled: boolean,
};

class ErrorDialog extends React.Component<Props> {
    static getItemWithName(name: string, message: string) {
        return (
            <React.Fragment>
                {name}: {message}
            </React.Fragment>
        );
    }

    static getItemWithoutName(message: string) {
        return (
            <React.Fragment>
                {message}
            </React.Fragment>
        );
    }
    getContents(): Array<React.Node> {
        const { errors } = this.props;

        return errors
            .map(errorData => (
                <li
                    key={errorData.key}
                >
                    {errorData.name ?
                        ErrorDialog.getItemWithName(errorData.name, errorData.error) :
                        ErrorDialog.getItemWithoutName(errorData.error)
                    }
                </li>
            ));
    }

    getButtons() {
        const { onAbort, onSave, saveEnabled } = this.props;

        return (
            <React.Fragment>
                <Button onClick={onAbort} color="primary">
                    {i18n.t('Back to form')}
                </Button>
                {saveEnabled ? (
                    <Button onClick={onSave} color="primary" autoFocus>
                        {i18n.t('Save anyway')}
                    </Button>) : null
                }
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <DialogTitle id="save-dialog-errors-title">
                    {i18n.t('Validation errors')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.getContents()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {this.getButtons()}
                </DialogActions>
            </React.Fragment>
        );
    }
}

export default ErrorDialog;
