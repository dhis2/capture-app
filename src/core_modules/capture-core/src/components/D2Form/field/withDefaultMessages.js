// @flow
import * as React from 'react';
import { withStyles } from 'material-ui-next/styles';
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
        color: 'yellow',
    },
    info: {
        color: 'green',
    },
    validating: {
        color: 'orange',
    },
});

type Props = {
    errorText: ?string,
    warningText: ?string,
    infoText: ?string,
    validatingText: ?string,
    touched: boolean,
    formCompletionAttempted: boolean,
    classes: {
        base: Object,
        error: Object,
        warning: Object,
        info: Object,
        validating: Object
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

        static getMessageElement(errorText, warningText, infoText, validatingText, classes) {
            let messageElement;

            if (validatingText) {
                messageElement = FieldMessages.createMessageElement(validatingText, classNames(classes.validating, classes.base));
            } else if (errorText) {
                messageElement = FieldMessages.createMessageElement(errorText, classNames(classes.error, classes.base));
            } else if (warningText) {
                messageElement = FieldMessages.createMessageElement(warningText, classNames(classes.warning, classes.base));
            } else if (infoText) {
                messageElement = FieldMessages.createMessageElement(infoText, classNames(classes.info, classes.base));
            }

            return messageElement;
        }

        render() {
            const { classes, errorText, warningText, infoText, validatingText, touched, validationAttempted, ...passOnProps } = this.props;
            const messageElement = (touched || validationAttempted) ? FieldMessages.getMessageElement(errorText, warningText, infoText, validatingText, classes) : null;

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
