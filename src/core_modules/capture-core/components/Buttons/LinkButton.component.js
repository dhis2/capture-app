// @flow
import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
    button: {
        border: 'none',
        fontSize: theme.typography.pxToRem(16),
        display: 'inline-block',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
            cursor: 'default',
        },
    },
});

type Props = {
    classes: {
        contents: string,
        button: string,
    },
    onClick: () => void,
    className?: ?string,
    muiClasses: Object,
    children: React.Node,
    disabled?: ?boolean,
    muiButtonRef: (muiButtonInstance: any) => void,
};

const LinkButtonPlain = (props: Props) => {
    const { classes, children, muiClasses, muiButtonRef, className, ...passOnProps } = props;
    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <button
            className={classNames(classes.button, className)}
            {...passOnProps}
        >
            {children}
        </button>
    );
};

export const LinkButton = withStyles(styles)(LinkButtonPlain);
