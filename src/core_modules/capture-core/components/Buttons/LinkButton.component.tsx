import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

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
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
} & WithStyles<typeof styles>;

const LinkButtonPlain = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { classes, children, className, ...passOnProps } = props;
    return (
        <button
            ref={ref}
            className={classNames(classes.button, className)}
            {...passOnProps}
        >
            {children}
        </button>
    );
});

export const LinkButton = withStyles(styles)(LinkButtonPlain);
