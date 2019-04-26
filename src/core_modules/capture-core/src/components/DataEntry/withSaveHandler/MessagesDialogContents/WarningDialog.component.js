// @flow
import * as React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../Buttons/Button.component';

type Props = {
    warnings: Array<{name: string, warning: string }>,
    onSave: () => void,
    onAbort: () => void,
};

class ErrorAndWarningDialog extends React.Component<Props> {
    getContents(): Array<React.Node> {
        const { warnings } = this.props;

        return warnings
            .map((warningData, index) => (
                <div>
                    {(index + 1).toString()}. {warningData.name}: {warningData.warning}
                </div>
            ));
    }

    render() {
        const { onAbort, onSave } = this.props;
        return (
            <React.Fragment>
                <DialogTitle id="save-dialog-errors-and-warnings-title">
                    {i18n.t('Validation warnings')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.getContents()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onAbort} color="primary">
                        {i18n.t('Back to form')}
                    </Button>
                    <Button onClick={onSave} color="primary" autoFocus>
                        {i18n.t('Save anyway')}
                    </Button>
                </DialogActions>
            </React.Fragment>
        );
    }
}

export default ErrorAndWarningDialog;
