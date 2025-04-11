import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NoticeBox } from '@dhis2/ui';

const getStyles = () => ({
    errorContainer: {
        margin: 20,
    },
});

type Props = {
    error?: string | null;
    classes: {
        errorContainer: string;
    };
};

export const withErrorMessageHandler = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(getStyles)((props: Props) => {
            const { error, classes, ...passOnProps } = props;

            if (error) {
                return React.createElement(
                    NoticeBox,
                    {
                        error: true,
                        dataTest: 'error-message-handler',
                        className: classes.errorContainer,
                    },
                    React.createElement('div', null, error),
                );
            }

            return React.createElement(
                InnerComponent,
                passOnProps,
            );
        });
