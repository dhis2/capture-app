// @flow
import * as React from 'react';

import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    button: {},
    contents: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

type Props = {
    classes: {
        contents: string,
        button: string,
    },
    muiClasses: Object,
    children: React.Node,
};

const Button = (props: Props) => {
    const { classes, children, muiClasses, ...passOnProps } = props;

    return (
        <MuiButton
            className={classes.button}
            classes={muiClasses}
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

