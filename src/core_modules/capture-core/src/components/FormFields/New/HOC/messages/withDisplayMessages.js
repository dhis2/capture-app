// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import isObject from 'd2-utilizr/lib/isObject';

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
        color: 'orange',
        fontSize: theme.typography.pxToRem(14),
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
        validating: string
    }
};

type MessageContainer = {
    element?: ?React.Element<any>,
    innerMessage?: ?Object,
}

const getDisplayMessagesHOC = (InnerComponent: React.ComponentType<any>) =>
    class DisplayMessagesHOC extends React.Component<Props> {
        static createMessageElement(text, classes) {
            return (
                <div
                    className={classes}
                >
                    {text}
                </div>
            );
        }

        convertMessage = (message, messageType: $Values<typeof messageTypes>): MessageContainer => (isObject(message) ?
            // $FlowSuppress
            { innerMessage: { message, messageType } } :
            { element: DisplayMessagesHOC.createMessageElement(message, this.getClassNames(this.props.classes[messageType])) })


        getClassNames(childClass) {
            return classNames(childClass, this.props.classes.base);
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
