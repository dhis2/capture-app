// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';

type Props = {
    classes: {
        borderBox: string,
    },
    contentClassName?: ?string,
    children: React.Node,
};

const styles = (theme: Theme) => ({
    borderBox: {
        borderRadius: theme.typography.pxToRem(6),
        borderWidth: theme.typography.pxToRem(2),
        borderColor: theme.palette.grey[300],
        borderStyle: 'solid',
    },
});

const BorderBox = (props: Props) => {
    const { classes, children, contentClassName } = props;
    return (
        <div className={classes.borderBox}>
            <div className={contentClassName}>
                {children}
            </div>
        </div>
    );
};

export default withStyles(styles)(BorderBox);
