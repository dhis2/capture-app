import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import { CircularLoader } from '@dhis2/ui';

const styles = {
    container: {
        left: '50%',
        position: 'fixed' as const,
        top: '50%',
        transform: 'translate(-50%, -50%)',
    },
};

type Props = WithStyles<typeof styles>;

const LoadingMaskForPagePlain = ({ classes }: Props) => (
    <div
        className={classes.container}
    >
        <CircularLoader />
    </div>
);

export const LoadingMaskForPage = withStyles(styles)(LoadingMaskForPagePlain) as ComponentType<Record<string, never>>;
