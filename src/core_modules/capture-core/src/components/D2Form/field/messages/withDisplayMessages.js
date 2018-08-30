// @flow
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
    errorMessage?: ?string,
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

        getClassNames(childClass) {
            return classNames(childClass, this.props.classes.base);
        }

        getMessage(errorText, warningText, infoText, validatingText, classes) {
            let messageElement;

            if (validatingText) {
                messageElement =
                    DisplayMessagesHOC.createMessageElement(validatingText, this.getClassNames(classes.validating));
            } else if (errorText) {
                messageElement = DisplayMessagesHOC.createMessageElement(errorText, this.getClassNames(classes.error));
            } else if (warningText) {
                messageElement =
                    DisplayMessagesHOC.createMessageElement(warningText, this.getClassNames(classes.warning));
            } else if (infoText) {
                messageElement = DisplayMessagesHOC.createMessageElement(infoText, this.getClassNames(classes.info));
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
                ...passOnProps
            } = this.props;

            const messageElement =
                this.getMessage(errorMessage, warningMessage, infoMessage, validatingMessage, classes);

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
        withStyles(styles)(getDisplayMessagesHOC(InnerComponent));
