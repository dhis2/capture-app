import * as React from 'react';

type Props = {
    errorMessage?: string | null;
    warningMessage?: string | null;
    infoMessage?: string | null;
    validatingMessage?: string | null;
    rulesErrorMessage?: string | null;
    rulesWarningMessage?: string | null;
    rulesErrorMessageOnComplete?: string | null;
    rulesWarningMessageOnComplete?: string | null;
    rulesCompulsoryError?: string | null;
    touched: boolean;
    validationAttempted?: boolean | null;
};

const typeKeysForProperty = {
    VALIDATING: 'validatingMessage',
    ERROR: 'errorMessage',
    WARNING: 'warningMessage',
    INFO: 'infoMessage',
};

const messageKeys = {
    errorMessages: 'errorMessage',
    warningMessages: 'warningMessage',
    infoMessages: 'infoMessage',
    validatingMessages: 'validatingMessage',
};

const getCalculateMessagesHOC = (InnerComponent: React.ComponentType<any>, overrideMessagesPropNames: any = {}) =>
    class CalculateMessagesHOC extends React.Component<Props> {
        static getMessage(errorText?: string | null, warningText?: string | null, infoText?: string | null, validatingText?: string | null) {
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
            errorText?: string | null,
            warningText?: string | null,
            errorTextOnComplete?: string | null,
            warningTextOnComplete?: string | null,
            rulesCompulsoryError?: string | null,
            touched?: boolean,
            validationAttempted?: boolean | null,
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

        getMessage = (messageKey: any) => (
            overrideMessagesPropNames[messageKey] ?
                this.props[overrideMessagesPropNames[messageKey]] : (this.props as any)[messageKey]
        );

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

            let messageContainer: any =
                (touched || validationAttempted) ?
                    CalculateMessagesHOC.getMessage(
                        this.getMessage(messageKeys.errorMessages),
                        this.getMessage(messageKeys.warningMessages),
                        this.getMessage(messageKeys.infoMessages),
                        this.getMessage(messageKeys.validatingMessages),
                    ) :
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

export const withCalculateMessages = (overrideMessagesPropNames?: any) =>
    (InnerComponent: React.ComponentType<any>) =>
        (getCalculateMessagesHOC(InnerComponent, overrideMessagesPropNames));
