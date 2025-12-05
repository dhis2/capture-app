import * as React from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';

const styles = (theme: any) => ({
    borderBox: {
        borderRadius: theme.typography.pxToRem(6),
        borderWidth: theme.typography.pxToRem(2),
        borderColor: '#e0e0e0',
        borderStyle: 'solid',
    },
});

type BorderBoxPlainProps = {
    contentClassName?: string;
    children: React.ReactNode;
};

type Props = BorderBoxPlainProps & WithStyles<typeof styles>;

const BorderBoxPlain = (props: Props) => {
    const { classes, children, contentClassName } = props;
    return (
        <div className={classes.borderBox}>
            <div className={contentClassName}>
                {children}
            </div>
        </div>
    );
};

export const BorderBox = withStyles(styles)(BorderBoxPlain) as React.ComponentType<Props>;
