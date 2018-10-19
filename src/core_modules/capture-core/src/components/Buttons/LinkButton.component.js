// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = (theme: Theme) => ({
    button: {
        display: 'inline-block',
        color: theme.palette.primary,
        textDecoration: 'underline',
        cursor: 'pointer',
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
    muiButtonRef: (muiButtonInstance: any) => void,
};

const LinkButton = (props: Props) => {
    const { classes, children, muiClasses, muiButtonRef, className, ...passOnProps } = props;
    return (
        <div
            className={classNames(classes.button, className)}
            role="button"
            tabIndex="0"
            {...passOnProps}
        >
            {children}
        </div>
    );
};

export default withStyles(styles)(LinkButton);
