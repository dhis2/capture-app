// @flow
import * as React from 'react';

import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
        justifyContent: 'center',
    },
});

const Button = (props: Props) => {
    const { classes, children, ...passOnProps } = props;
    const { button: buttonClass, contents: contentsClass, ...passOnClasses } = classes;

    return (
        <MuiButton
            className={buttonClass}
            classes={passOnClasses}
            {...passOnProps}
        >
            <div
                className={contentsClass}
            >
                {children}
            </div>
        </MuiButton>
    );
};

export default withStyles(styles)(Button);

