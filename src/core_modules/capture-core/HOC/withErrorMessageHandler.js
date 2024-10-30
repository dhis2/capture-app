// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NoticeBox } from '@dhis2/ui';

const getStyles = () => ({
    errorContainer: {
        margin: 20,
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
