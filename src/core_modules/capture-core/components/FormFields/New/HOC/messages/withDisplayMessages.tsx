import * as React from 'react';
import { CircularLoader, colors } from '@dhis2/ui';
import { withStyles, WithStyles } from 'capture-core-utils/styles';

import { cx } from '@emotion/css';
import isObject from 'd2-utilizr/lib/isObject';

const styles = (theme: any) => ({
    base: {
        paddingTop: 10,
        marginInlineStart: 0,
        paddingInlineStart: 0,
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
        marginInlineEnd: 4,
    },
    listItem: {
        listStylePosition: 'inside',
    },
}) as const;

const messageTypes = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    validating: 'validating',
};

type Props = {
    validatingMessage?: string | Array<string> | null;
    errorMessage?: string | Array<string> | null;
    warningMessage?: string | Array<string> | null;
    infoMessage?: string | Array<string> | null;
};

type MessageContainer = {
    element?: React.ReactElement<any> | null;
    innerMessage?: Record<string, unknown> | null;
};

const getDisplayMessagesHOC = (InnerComponent: React.ComponentType<any>) =>
    class DisplayMessagesHOC extends React.Component<Props & WithStyles<typeof styles>> {
        static createMessageElement(text, baseClass, messageClass, validatorClasses, listItemClass, type) {
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
                <ul
                    data-test="error-message"
                    className={cx(baseClass, messageClass)}
                >
                    {Array.isArray(text) ? text?.map(message => (
                        <li className={listItemClass}>
                            {message}<br />
                        </li>
                    )) : text}
                </ul>
            );
        }

        convertMessage = (message: any, messageType: typeof messageTypes[keyof typeof messageTypes]): MessageContainer => {
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
                    classes.listItem,
                    messageType,
                ),
            };
        }

        getMessage(errorMessages, warningMessage, infoMessage, validatingMessage) {
            let messages: any = {};

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
            const messages: any =
                this.getMessage(errorMessage, warningMessage, infoMessage, validatingMessage);

            const calculatedMessageProps = messages.innerMessage ? { innerMessage: messages.innerMessage } : null;
            return (
                <div>
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
        withStyles(styles)(getDisplayMessagesHOC(InnerComponent) as any);
