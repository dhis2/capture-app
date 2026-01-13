import * as React from 'react';
import { cx } from '@emotion/css';
import { withStyles, WithStyles } from 'capture-core-utils/styles';

const styles = (theme: any) => ({
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
            className={cx(classes.button, className)}
            {...passOnProps}
        >
            {children}
        </button>
    );
});

export const LinkButton = withStyles(styles)(LinkButtonPlain);
