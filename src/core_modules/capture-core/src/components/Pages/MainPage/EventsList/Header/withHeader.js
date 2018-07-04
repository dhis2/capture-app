// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const getStyles = (theme: Theme) => ({
    container: {
        backgroundColor: '#fff',
    },
    title: {
        ...theme.typography.title,
    },
});

type Props = {
    classes: {
        container: string,
        title: string,
    },
};

export default () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(getStyles)((props: Props) => {
        const { classes, ...passOnProps } = props;

        return (
            <div
                className={classes.container}
            >
                <InnerComponent
                    {...passOnProps}
                    header={
                        <span
                            className={classes.title}
                        >
                            Registered events
                        </span>
                    }
                />
            </div>
        );
    });
