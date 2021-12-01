// @flow
import { withStyles } from '@material-ui/core/styles';
import * as React from 'react';

const getStyles = (theme: Theme) => ({
    errorContainer: {
        margin: 20,
        color: theme.palette.error.main,
    },
});

type Props = {
    error?: ?string,
    classes: {
        errorContainer: string,
    }
};

export const withErrorMessageHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(getStyles)((props: Props) => {
            const { error, classes, ...passOnProps } = props;

            if (error) {
                return (
                    <div
                        data-test="error-message-handler"
                        className={classes.errorContainer}
                    >
                        {error}
                    </div>
                );
            }

            return (
                <InnerComponent
                    {...passOnProps}
                />
            );
        });
