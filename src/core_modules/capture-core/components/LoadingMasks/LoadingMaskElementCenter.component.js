// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CircularLoader } from '@dhis2/ui';

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

const LoadingMaskElementCenterPlain = (props: Props) => {
    const { containerStyle, classes } = props;
    return (
        <div
            className={classes.container}
            style={containerStyle}
        >
            <CircularLoader />
        </div>
    );
};

export const LoadingMaskElementCenter = withStyles(styles)(LoadingMaskElementCenterPlain);
