// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

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

const withErrorMessageHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(getStyles)((props: Props) => {
            const { error, classes, ...passOnProps } = props;

            if (error) {
                return (
                    <div
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

export default withErrorMessageHandler;
