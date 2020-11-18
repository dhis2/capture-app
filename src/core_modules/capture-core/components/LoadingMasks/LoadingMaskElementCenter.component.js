// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LoadingMask from './LoadingMask.component';

const styles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 48px)',
    },
});

type Props = {
    classes: {
        container: string,
    },
    containerStyle?: ?Object,
};

const LoadingMaskForPage = (props: Props) => {
    const { containerStyle, classes, ...passOnProps } = props;
    return (
        <div
            className={classes.container}
            style={containerStyle}
        >
            <LoadingMask
                {...passOnProps}
            />
        </div>
    );
};

export default withStyles(styles)(LoadingMaskForPage);
