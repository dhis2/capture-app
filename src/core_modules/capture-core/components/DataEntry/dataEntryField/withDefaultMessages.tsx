import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import classNames from 'classnames';

const styles = (theme: any) => ({
    base: {
        paddingTop: 10,
    },
    error: {
        color: theme.palette.error.main,
        fontSize: theme.typography.pxToRem(12),
    },
});

type Props = {
    validationError: string;
    touched: boolean;
    validationAttempted: boolean;
} & WithStyles<typeof styles>;


const getFieldMessages = (InnerComponent: React.ComponentType<any>) =>
    class FieldMessages extends React.Component<Props> {
        static createMessageElement(text: string, classes: string) {
            return (
                <div
                    className={classes}
                >
                    {text}
                </div>
            );
        }

        static getMessageElement(validationError: string, classes: { base: string; error: string }) {
            let messageElement;

            if (validationError) {
                messageElement = FieldMessages.createMessageElement(
                    validationError, 
                    classNames(classes.error, classes.base)
                );
            }

            return messageElement;
        }

        render() {
            const { classes, validationError, touched, validationAttempted, ...passOnProps } = this.props;
            const messageElement = (touched || validationAttempted) ? 
                FieldMessages.getMessageElement(validationError, classes) : null;

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

export const withDefaultMessages = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles)(getFieldMessages(InnerComponent));
