import React, { type ComponentType } from 'react';
import { Tooltip, type TooltipProps } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';

type OwnProps = {
    enabled: boolean;
    onClick: () => void;
    children: React.ReactNode;
    content?: string;
    placement?: string;
    openDelay?: number;
};

type Props = OwnProps & WithStyles<typeof styles>;

const styles = {
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

    if (!enabled) {
        return (
            <button
                onClick={onClick}
                className={classes.button}
            >
                {children}
            </button>
        );
    }

    return (
        <Tooltip
            {...passOnProps as Omit<TooltipProps, 'children'>}
        >
            {({ ref, onMouseOver, onMouseOut }) => {
                const handleButtonRef = (buttonRef: HTMLButtonElement | null) => {
                    if (buttonRef) {
                        ref.current = buttonRef;
                    }
                };

                const handleFocus = onMouseOver as any;
                const handleBlur = onMouseOut as any;

                return (
                    <button
                        ref={handleButtonRef}
                        onClick={onClick}
                        className={classes.button}
                        onPointerEnter={onMouseOver}
                        onPointerLeave={onMouseOut}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    >
                        {children}
                    </button>
                );
            }}
        </Tooltip>
    );
};

export const TooltipForChip = withStyles(styles)(TooltipForChipPlain) as ComponentType<OwnProps>;
