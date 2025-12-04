import React from 'react';
import { cx } from '@emotion/css';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { colors } from '@dhis2/ui';
import type { PlainProps } from './iconButton.types';

const styles: Readonly<any> = {
    button: {
        cursor: 'pointer',
        borderRadius: '3px',
        border: 'none',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        padding: '2px',
        justifyContent: 'center',
        color: colors.grey700,
        '&:hover': {
            background: colors.grey200,
            color: colors.grey800,
        },
        '&:focus': {
            outline: 'solid',
            background: colors.grey200,
            color: colors.grey800,
        },
        '&.disabled': {
            color: colors.grey500,
            cursor: 'not-allowed',
        },
    },
};

const IconButtonPlain = ({
    children,
    className,
    dataTest,
    onClick,
    disabled,
    classes,
    ...passOnProps
}: PlainProps & WithStyles<typeof styles>) => (
    <button
        {...passOnProps}
        onClick={onClick}
        disabled={disabled}
        data-test={dataTest}
        className={cx(classes.button, { disabled, ...(className ? { [className]: true } : {}) })}
        type="button"
        tabIndex={0}
    >
        {children}
    </button>
);

export const IconButton = withStyles(styles)(IconButtonPlain);
