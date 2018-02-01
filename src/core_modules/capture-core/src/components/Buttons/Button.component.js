// @flow
import * as React from 'react';

import MuiButton from 'material-ui-next/Button';
import { withStyles } from 'material-ui-next/styles';

type Props = {
    classes: Object,
    children: React.Node,
};

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    contents: {
        display: 'flex',
        alignItems: 'center',
    },
});

const Button = (props: Props) => {
    const { classes, children, ...passOnProps } = props;

    return (
        <MuiButton
            className={classes.button}
            {...passOnProps}
        >
            <div
                className={classes.contents}
            >
                {children}
            </div>
        </MuiButton>
    );
};

export default withStyles(styles)(Button);

