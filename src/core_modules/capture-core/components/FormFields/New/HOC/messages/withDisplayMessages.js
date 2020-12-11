// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import isObject from 'd2-utilizr/lib/isObject';
import { LoadingMask } from '../../../../LoadingMasks';

const styles = (theme: Theme) => ({
    base: {
        paddingTop: 10,
    },
    error: {
        color: theme.palette.error.main,
        fontSize: theme.typography.pxToRem(14),
    },
    warning: {
        color: theme.palette.warning.dark,
        fontSize: theme.typography.pxToRem(14),
    },
    info: {
        color: 'green',
        fontSize: theme.typography.pxToRem(14),
    },
    validating: {
        color: theme.palette.grey.dark,
        fontSize: theme.typography.pxToRem(14),
    },
    validatingContainer: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.grey.dark,
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
    validatingMessage?: ?string,
    errorMessage?: ?(string | Object),
    warningMessage?: ?string,
    infoMessage?: ?string,
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
                                <LoadingMask
                                    size={14}
                                    color="inherit"
                                />
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
                    className={classNames(baseClass, messageClass)}
                >
                    {text}
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

        getMessage(errorMessage, warningMessage, infoMessage, validatingMessage) {
            let message = {};

            if (validatingMessage) {
                message = this.convertMessage(validatingMessage, messageTypes.validating);
            } else if (errorMessage) {
                message = this.convertMessage(errorMessage, messageTypes.error);
            } else if (warningMessage) {
                message = this.convertMessage(warningMessage, messageTypes.warning);
            } else if (infoMessage) {
                message = this.convertMessage(infoMessage, messageTypes.info);
            }

            return message;
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

            const message =
                this.getMessage(errorMessage, warningMessage, infoMessage, validatingMessage);

            const calculatedMessageProps = message.innerMessage ? { innerMessage: message.innerMessage } : null;
            return (
                <div>
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <InnerComponent
                        {...calculatedMessageProps}
                        {...passOnProps}
                    />
                    {message.element}
                </div>
            );
        }
    };

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getDisplayMessagesHOC(InnerComponent));
