// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ModalTitle, ModalContent, ModalActions } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';

type Props = {
    errors: Array<{key: string, name: ?string, error: string }>,
    onSave: () => void,
    onAbort: () => void,
    saveEnabled: boolean,
    ...CssClasses
};

class ErrorDialogPlain extends React.Component<Props> {
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
        const { onAbort, onSave, saveEnabled, classes } = this.props;

        return (
            <div>
                <Button onClick={onAbort} color="primary">
                    {i18n.t('Back to form')}
                </Button>
                {saveEnabled ? (
                    <Button
                        onClick={onSave}
                        primary
                        initialFocus
                        className={classes.marginLeft}
                    >
                        {i18n.t('Save anyway')}
                    </Button>) : null
                }
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                <ModalTitle id="save-dialog-errors-title">
                    {i18n.t('Validation errors')}
                </ModalTitle>
                <ModalContent>
                    {this.getContents()}
                </ModalContent>
                <ModalActions>
                    {this.getButtons()}
                </ModalActions>
            </React.Fragment>
        );
    }
}

const styles = () => ({
    marginLeft: {
        marginLeft: 8,
    },
});

export const ErrorDialog = withStyles(styles)(ErrorDialogPlain);
