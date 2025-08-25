import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { NoticeBox } from '@dhis2/ui';

const getStyles = () => ({
    errorContainer: {
        margin: 20,
    },
});

type Props = {
    error?: string | null | undefined;
};

export const withErrorMessageHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(getStyles)((props: Props & WithStyles<typeof getStyles>) => {
            const { error, classes, ...passOnProps } = props;

            if (error) {
                return (
                    <NoticeBox
                        error
                        dataTest="error-message-handler"
                        className={classes.errorContainer}
                    >
                        <div>{error}</div>
                    </NoticeBox>
                );
            }

            return (
                <InnerComponent
                    {...passOnProps}
                />
            );
        });
