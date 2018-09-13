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
        fontSize: theme.typography.pxToRem(12),
    },
    warning: {
        color: theme.palette.warning.dark,
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

        static getMessage(message, classes: string): MessageContainer {
            return isObject(message) ?
                // $FlowSuppress
                { innerMessage: message } :
                { element: DisplayMessagesHOC.createMessageElement(message, classes) }
            ;
        }


        getClassNames(childClass) {
            return classNames(childClass, this.props.classes.base);
        }

        getMessage(errorMessage, warningMessage, infoMessage, validatingMessage, classes) {
            let message = {};

            if (validatingMessage) {
                message = DisplayMessagesHOC.getMessage(validatingMessage, this.getClassNames(classes.validating));
            } else if (errorMessage) {
                message = DisplayMessagesHOC.getMessage(errorMessage, this.getClassNames(classes.error));
            } else if (warningMessage) {
                message = DisplayMessagesHOC.getMessage(warningMessage, this.getClassNames(classes.warning));
            } else if (infoMessage) {
                message = DisplayMessagesHOC.getMessage(infoMessage, this.getClassNames(classes.info));
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
                this.getMessage(errorMessage, warningMessage, infoMessage, validatingMessage, classes);

            return (
                <div>
                    <InnerComponent
                        innerMessage={message.innerMessage}
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
