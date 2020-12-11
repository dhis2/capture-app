// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../Buttons/Button.component';

const getStyles = (theme: Theme) => ({
  errors: {
    border: `1px solid ${theme.palette.grey.light}`,
    borderRadius: theme.typography.pxToRem(4),
    padding: 5,
  },
  warningsLabel: {
    paddingTop: 20,
  },
  warnings: {
    border: `1px solid ${theme.palette.grey.light}`,
    borderRadius: theme.typography.pxToRem(4),
    padding: 5,
  },
});

type Props = {
  errors: Array<{ key: string, name: string, error: string }>,
  warnings: Array<{ key: string, name: string, warning: string }>,
  onSave: () => void,
  onAbort: () => void,
  saveEnabled: boolean,
  classes: Object,
};

class ErrorAndWarningDialog extends React.Component<Props> {
  static getItemWithName(name: string, message: string) {
    return (
      <>
        {name}: {message}
      </>
    );
  }

  static getItemWithoutName(message: string) {
    return <>{message}</>;
  }

  getContents(): React.Node {
    const { warnings, errors, classes } = this.props;

    const warningElements = warnings.map((warningData) => (
      <li key={warningData.key}>
        {warningData.name
          ? ErrorAndWarningDialog.getItemWithName(warningData.name, warningData.warning)
          : ErrorAndWarningDialog.getItemWithoutName(warningData.warning)}
      </li>
    ));

    const errorElements = errors.map((errorData) => (
      <li key={errorData.key}>
        {errorData.name
          ? ErrorAndWarningDialog.getItemWithName(errorData.name, errorData.error)
          : ErrorAndWarningDialog.getItemWithoutName(errorData.error)}
      </li>
    ));

    return (
      <div>
        <div>
          {errorElements.length > 1
            ? i18n.t('The following errors were found:')
            : i18n.t('The following error was found:')}
        </div>
        <div className={classes.errors}>{errorElements}</div>
        <div className={classes.warningsLabel}>
          {warningElements.length > 1
            ? i18n.t('The following warnings were found:')
            : i18n.t('The following warning was found:')}
        </div>
        <div className={classes.warnings}>{warningElements}</div>
      </div>
    );
  }

  getButtons() {
    const { onAbort, onSave, saveEnabled } = this.props;

    return (
      <>
        <Button onClick={onAbort} color="primary">
          {i18n.t('Back to form')}
        </Button>
        {saveEnabled ? (
          <Button onClick={onSave} color="primary" autoFocus>
            {i18n.t('Save anyway')}
          </Button>
        ) : null}
      </>
    );
  }

  render() {
    return (
      <>
        <DialogTitle id="save-dialog-errors-and-warnings-title">
          {i18n.t('Validation errors and warnings')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{this.getContents()}</DialogContentText>
        </DialogContent>
        <DialogActions>{this.getButtons()}</DialogActions>
      </>
    );
  }
}

export default withStyles(getStyles)(ErrorAndWarningDialog);
