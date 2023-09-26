// @flow
import React, { useState, useEffect } from 'react';
import { IconButton } from 'capture-ui';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { colors, spacersNum, IconChevronUp24 } from '@dhis2/ui';

type ChevronIconProps = {
    open: boolean,
    dataTest?: string,
    onOpen: () => void,
    onClose: () => void,
    disabled?: boolean,
    ...CssClasses,
};

const styles = {
    toggleButton: {
        margin: `0 0 0 ${spacersNum.dp4}px`,
        height: '24px',
        borderRadius: '3px',
        color: colors.grey600,
        '&:hover': {
            background: colors.grey200,
            color: colors.grey800,
        },
        '&.open': {
            animation: 'flipOpen 200ms normal forwards linear',
        },
        '&.close': {
            animation: 'flipClose 200ms normal forwards linear',
        },
        '&.closeinit': {
            transform: 'rotateX(180deg)',
        },
        '&.disabled': {
            color: colors.grey400,
            cursor: 'not-allowed',
        },
    },
    '@keyframes flipOpen': {
        from: { transform: 'rotateX(180deg)' },
        to: { transform: 'rotateX(0)' },
    },
    '@keyframes flipClose': {
        from: { transform: 'rotateX(0)' },
        to: { transform: 'rotateX(180deg)' },
    },
};

const ChevronIconPlain = ({ open, onOpen, onClose, dataTest, disabled, classes }: ChevronIconProps) => {
    const [postEffectOpen, setPostEffectOpenStatus] = useState(open);
    const [animationsReady, setAnimationsReadyStatus] = useState(false);

    const handleClick = () => {
        if (disabled) {
            return null;
        }
        return open ? onClose() : onOpen();
    };

    useEffect(() => {
        if (!animationsReady) {
            setAnimationsReadyStatus(true);
        }

        setPostEffectOpenStatus(open);
    }, [open, animationsReady]);

    return (
        <IconButton
            dataTest={dataTest}
            className={cx(classes.toggleButton, {
                closeinit: !animationsReady && !postEffectOpen,
                open: animationsReady && postEffectOpen,
                close: animationsReady && !postEffectOpen,
                disabled,
            })}
            onClick={handleClick}
            disabled={disabled}
        >
            <IconChevronUp24 />
        </IconButton>
    );
};

export const ChevronIcon = withStyles(styles)(ChevronIconPlain);

