// @flow
/* eslint-disable complexity */
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = (theme: Theme) => ({
    base: {
        paddingTop: 10,
    },
    error: {
        color: theme.palette.error.main,
        fontSize: theme.typography.pxToRem(12),
    },
    warning: {
        color: theme.palette.warning.main,
        fontSize: theme.typography.pxToRem(12),
    },
    info: {
        color: 'green',
        fontSize: theme.typography.pxToRem(12),
    },
    validating: {
        color: 'orange',
        fontSize: theme.typography.pxToRem(12),
    },
});

type Props = {
    errorMessage: ?string,
    warningMessage?: ?string,
    infoMessage?: ?string,
    validatingMessage?: ?string,
    rulesErrorMessage: ?string,
    rulesWarningMessage: ?string,
    rulesErrorMessageOnComplete: ?string,
    rulesWarningMessageOnComplete: ?string,
    rulesCompulsoryError?: ?string,
    touched: boolean,
    validationAttempted?: ?boolean,
    classes: {
        base: string,
        error: string,
        warning: string,
        info: string,
        validating: string
    }
};


const getFieldMessages = (InnerComponent: React.ComponentType<any>) =>
    class FieldMessages extends React.Component<Props> {
        static createMessageElement(text, classes) {
            return (
                <div
                    className={classes}
                >
                    {text}
                </div>
            );
        }

        getClassNames(childClass) {
            return classNames(childClass, this.props.classes.base);
        }

        getMessageElement(errorText, warningText, infoText, validatingText, classes) {
            let messageElement;

            if (validatingText) {
                messageElement =
                    FieldMessages.createMessageElement(validatingText, this.getClassNames(classes.validating));
            } else if (errorText) {
                messageElement = FieldMessages.createMessageElement(errorText, this.getClassNames(classes.error));
            } else if (warningText) {
                messageElement = FieldMessages.createMessageElement(warningText, this.getClassNames(classes.warning));
            } else if (infoText) {
                messageElement = FieldMessages.createMessageElement(infoText, this.getClassNames(classes.info));
            }

            return messageElement;
        }

        getRulesMessageElement(
            errorText,
            warningText,
            errorTextOnComplete,
            warningTextOnComplete,
            rulesCompulsoryError,
            touched,
            validationAttempted,
            classes) {
            let messageElement;

            if (errorText) {
                messageElement =
                    FieldMessages.createMessageElement(errorText, this.getClassNames(classes.error));
            } else if (errorTextOnComplete && validationAttempted) {
                messageElement =
                    FieldMessages.createMessageElement(errorTextOnComplete, this.getClassNames(classes.error));
            } else if (warningText) {
                messageElement =
                    FieldMessages.createMessageElement(warningText, this.getClassNames(classes.warning));
            } else if (warningTextOnComplete && validationAttempted) {
                messageElement =
                    FieldMessages.createMessageElement(warningTextOnComplete, this.getClassNames(classes.warning));
            } else if (rulesCompulsoryError && (touched || validationAttempted)) {
                messageElement =
                    FieldMessages.createMessageElement(rulesCompulsoryError, this.getClassNames(classes.error));
            }

            return messageElement;
        }

        render() {
            const {
                classes,
                errorMessage,
                warningMessage,
                infoMessage,
                validatingMessage,
                rulesErrorMessage,
                rulesWarningMessage,
                rulesErrorMessageOnComplete,
                rulesWarningMessageOnComplete,
                rulesCompulsoryError,
                touched,
                validationAttempted,
                ...passOnProps
            } = this.props;
            let messageElement =
                (touched || validationAttempted) ?
                    this.getMessageElement(errorMessage, warningMessage, infoMessage, validatingMessage, classes) :
                    null;
            if (!messageElement) {
                messageElement =
                    this.getRulesMessageElement(
                        rulesErrorMessage,
                        rulesWarningMessage,
                        rulesErrorMessageOnComplete,
                        rulesWarningMessageOnComplete,
                        rulesCompulsoryError,
                        touched,
                        validationAttempted,
                        classes);
            }

            return (
                <div>
                    <InnerComponent
                        {...passOnProps}
                    />
                    {messageElement}
                </div>
            );
        }
    };

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getFieldMessages(InnerComponent));
