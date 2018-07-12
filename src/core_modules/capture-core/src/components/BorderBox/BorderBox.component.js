// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

type Props = {
    classes: {
        borderBox: string,
        contents: string,
    },
    children: React.Node,
};

const styles = (theme: Theme) => ({
    borderBox: {
        borderRadius: theme.typography.pxToRem(6),
        borderWidth: theme.typography.pxToRem(2),
        borderColor: theme.palette.grey[300],
        borderStyle: 'solid',
        padding: theme.typography.pxToRem(10),
    },
    contents: {
        display: 'flex',
        alignItems: 'center',
    },
});

const BorderBox = (props: Props) => {
    const { classes, children } = props;

    return (
        <div className={classes.borderBox}>
            <div className={classes.contents}>
                {children}
            </div>
        </div>
    );
};

export default withStyles(styles)(BorderBox);
