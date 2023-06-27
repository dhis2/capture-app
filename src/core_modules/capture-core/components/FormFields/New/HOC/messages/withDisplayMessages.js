// @flow
import * as React from 'react';
import { CircularLoader, colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import isObject from 'd2-utilizr/lib/isObject';

const styles = (theme: Theme) => ({
    base: {
        paddingTop: 10,
    },
    error: {
        color: colors.red600,
        fontSize: theme.typography.pxToRem(14),
    },
    warning: {
        color: colors.yellow800,
        fontSize: theme.typography.pxToRem(14),
    },
    info: {
        color: colors.green700,
        fontSize: theme.typography.pxToRem(14),
    },
    validating: {
        color: colors.grey700,
        fontSize: theme.typography.pxToRem(14),
    },
    validatingContainer: {
        display: 'flex',
        alignItems: 'center',
        color: colors.grey700,
    },
    validatingIndicator: {
        fontSize: 12,
        marginTop: 1,
        marginRight: 4,
    },
});

const messageTypes = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    validating: 'validating',
};

type Props = {
    validatingMessage?: ?string | ?Array<string>,
    errorMessage?: ?string | ?Array<string>,
    warningMessage?: ?string | ?Array<string>,
    infoMessage?: ?string | ?Array<string>,
    classes: {
        base: string,
        error: string,
        warning: string,
        info: string,
        validating: string,
        validatingContainer: string,
        validatingIndicator: string,
    }
};

type MessageContainer = {
    element?: ?React.Element<any>,
    innerMessage?: ?Object,
}

const getDisplayMessagesHOC = (InnerComponent: React.ComponentType<any>) =>
    class DisplayMessagesHOC extends React.Component<Props> {
        static createMessageElement(text, baseClass, messageClass, validatorClasses, type) {
            if (type === messageTypes.validating) {
                return (
                    <div
                        className={baseClass}
                    >
                        <div
                            className={validatorClasses.container}
                        >
                            <div
                                className={validatorClasses.indicator}
                            >
                                <CircularLoader small />
                            </div>
                            <div
                                className={messageClass}
                            >
                                {text}
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div
                    data-test="error-message"
                    className={classNames(baseClass, messageClass)}
                >
                    {Array.isArray(text) ? text?.map(message => (
                        <span>
                            {message}<br />
                        </span>
                    )) : text}
                </div>
            );
        }

        convertMessage = (message, messageType: $Values<typeof messageTypes>): MessageContainer => {
            if (isObject(message) && !React.isValidElement(message)) {
                return {
                    innerMessage: { message, messageType },
                };
            }

            const { classes } = this.props;
            return {
                element: DisplayMessagesHOC.createMessageElement(
                    message,
                    classes.base,
                    classes[messageType],
                    {
                        container: classes.validatingContainer,
                        indicator: classes.validatingIndicator,
                    },
                    messageType,
                ),
            };
        }

        getMessage(errorMessages, warningMessage, infoMessage, validatingMessage) {
            let messages = {};

            if (validatingMessage) {
                messages = this.convertMessage(validatingMessage, messageTypes.validating);
            } else if (errorMessages) {
                messages = this.convertMessage(errorMessages, messageTypes.error);
            } else if (warningMessage) {
                messages = this.convertMessage(warningMessage, messageTypes.warning);
            } else if (infoMessage) {
                messages = this.convertMessage(infoMessage, messageTypes.info);
            }

            return messages;
        }

        render() {
            const {
                classes,
                errorMessage,
                warningMessage,
                infoMessage,
                validatingMessage,
                ...passOnProps
            } = this.props;

            const messages =
                this.getMessage(errorMessage, warningMessage, infoMessage, validatingMessage);

            const calculatedMessageProps = messages.innerMessage ? { innerMessage: messages.innerMessage } : null;
            return (
                <div>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerComponent
                        {...calculatedMessageProps}
                        {...passOnProps}
                    />
                    {messages.element}
                </div>
            );
        }
    };

export const withDisplayMessages = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getDisplayMessagesHOC(InnerComponent));
