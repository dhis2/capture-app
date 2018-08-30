// @flow
/* eslint-disable complexity */
import * as React from 'react';

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
};

const typeKeysForProperty = {
    VALIDATING: 'validatingMessage',
    ERROR: 'errorMessage',
    WARNING: 'warningMessage',
    INFO: 'infoMessage',
};


const getCalculateMessagesHOC = (InnerComponent: React.ComponentType<any>) =>
    class CalculateMessagesHOC extends React.Component<Props> {
        static getMessage(errorText: ?string, warningText: ?string, infoText: ?string, validatingText: ?string) {
            let message;
            let typeKey;

            if (validatingText) {
                message = validatingText;
                typeKey = typeKeysForProperty.VALIDATING;
            } else if (errorText) {
                message = errorText;
                typeKey = typeKeysForProperty.ERROR;
            } else if (warningText) {
                message = warningText;
                typeKey = typeKeysForProperty.WARNING;
            } else if (infoText) {
                message = infoText;
                typeKey = typeKeysForProperty.INFO;
            }

            return {
                message,
                typeKey,
            };
        }

        static getRulesMessage(
            errorText: ?string,
            warningText: ?string,
            errorTextOnComplete: ?string,
            warningTextOnComplete: ?string,
            rulesCompulsoryError: ?string,
            touched: boolean,
            validationAttempted: ?boolean,
        ) {
            let message;
            let typeKey;

            if (errorText) {
                message = errorText;
                typeKey = typeKeysForProperty.ERROR;
            } else if (errorTextOnComplete && validationAttempted) {
                message = errorTextOnComplete;
                typeKey = typeKeysForProperty.ERROR;
            } else if (warningText) {
                message = warningText;
                typeKey = typeKeysForProperty.WARNING;
            } else if (warningTextOnComplete && validationAttempted) {
                message = warningTextOnComplete;
                typeKey = typeKeysForProperty.WARNING;
            } else if (rulesCompulsoryError && (touched || validationAttempted)) {
                message = rulesCompulsoryError;
                typeKey = typeKeysForProperty.ERROR;
            }

            return {
                message,
                typeKey,
            };
        }

        render() {
            const {
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
            let messageContainer =
                (touched || validationAttempted) ?
                    CalculateMessagesHOC.getMessage(errorMessage, warningMessage, infoMessage, validatingMessage) :
                    {};

            if (!messageContainer.message) {
                messageContainer =
                    CalculateMessagesHOC.getRulesMessage(
                        rulesErrorMessage,
                        rulesWarningMessage,
                        rulesErrorMessageOnComplete,
                        rulesWarningMessageOnComplete,
                        rulesCompulsoryError,
                        touched,
                        validationAttempted,
                    );
            }

            const passOnMessage =
                messageContainer.message ? {
                    // $FlowSuppress
                    [messageContainer.typeKey]: messageContainer.message,
                } : null;

            return (
                <div>
                    <InnerComponent
                        {...passOnMessage}
                        {...passOnProps}
                    />
                </div>
            );
        }
    };

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        (getCalculateMessagesHOC(InnerComponent));
