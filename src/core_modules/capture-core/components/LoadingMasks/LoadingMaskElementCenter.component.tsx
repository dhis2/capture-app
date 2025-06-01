import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import { CircularLoader } from '@dhis2/ui';

const styles: Readonly<any> = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 48px)',
    },
};

type OwnProps = {
    containerStyle?: React.CSSProperties;
};
type Props = OwnProps & WithStyles<typeof styles>;

const LoadingMaskElementCenterPlain = ({ containerStyle, classes }: Props) => (
    <div
        className={classes.container}
        style={containerStyle}
    >
        <CircularLoader />
    </div>
);

export const LoadingMaskElementCenter = withStyles(styles)(LoadingMaskElementCenterPlain) as ComponentType<OwnProps>;
