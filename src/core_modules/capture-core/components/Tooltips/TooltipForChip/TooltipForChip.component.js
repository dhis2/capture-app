// @flow
import React from 'react';
import { Tooltip } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/';

type Props = {
    enabled: boolean,
    onClick: Function,
    children: any,
    ...CssClasses,
};

const styles = {
    // button style reset
    button: {
        border: 'none',
        backgroundColor: 'transparent',
        borderRadius: '16px',
        padding: 0,
        margin: 0,
        minWidth: 0,
        minHeight: 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
};
const TooltipForChipPlain = (props: Props) => {
    const { enabled, children, classes, onClick, ...passOnProps } = props;

    return enabled ?
        (
            <Tooltip
                {...passOnProps}
            >
                {({ ref, onMouseOver, onMouseOut }) => (
                    <button
                        ref={ref}
                        onClick={onClick}
                        className={classes.button}
                        onPointerEnter={onMouseOver}
                        onPointerLeave={onMouseOut}
                        onFocus={onMouseOver}
                        onBlur={onMouseOut}
                    >
                        {children}
                    </button>
                )}
            </Tooltip>
        ) : (
            <button
                onClick={onClick}
                className={classes.button}
            >
                {children}
            </button>
        );
};

export const TooltipForChip = withStyles(styles)(TooltipForChipPlain);
