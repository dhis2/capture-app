// @flow
import * as React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../Buttons/Button.component';

type Props = {
    warnings: Array<{key: string, name: ?string, warning: string }>,
    onSave: () => void,
    onAbort: () => void,
};

class WarningDialog extends React.Component<Props> {
    static getItemWithName(name: string, message: string) {
        return (
            <>
                {name}: {message}
            </>
        );
    }

    static getItemWithoutName(message: string) {
        return (
            <>
                {message}
            </>
        );
    }

    getContents(): Array<React.Node> {
        const { warnings } = this.props;

        return warnings
            .map(warningData => (
                <li
                    key={warningData.key}
                >
                    {warningData.name ?
                        WarningDialog.getItemWithName(warningData.name, warningData.warning) :
                        WarningDialog.getItemWithoutName(warningData.warning)
                    }
                </li>
            ));
    }

    render() {
        const { onAbort, onSave } = this.props;
        return (
            <>
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
            </>
        );
    }
}

export default WarningDialog;
