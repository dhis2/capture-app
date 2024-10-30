// @flow
import React, { type ComponentType, useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import { colors, IconChevronUp24, spacersNum } from '@dhis2/ui';
import { IconButton } from 'capture-ui';
import type { WidgetCollapsibleProps, WidgetCollapsiblePropsPlain } from './widgetCollapsible.types';

const styles = {
    headerContainer: {
        borderRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        '&.childrenVisible': {
            borderBottomWidth: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        '&.borderless': {
            border: 'none',
        },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacersNum.dp16,
        fontWeight: 500,
        fontSize: 16,
        color: colors.grey800,
    },
    children: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        borderTopWidth: 0,
        '&.open': {
            animation: 'slidein 200ms normal forwards ease-in-out',
            transformOrigin: '50% 0%',
        },
        '&.close': {
            animation: 'slideout 200ms normal forwards ease-in-out',
            transformOrigin: '100% 0%',
        },
        '&.borderless': {
            border: 'none',
        },
    },
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
    },
    '@keyframes slidein': {
        from: { transform: 'scaleY(0)' },
        to: { transform: 'scaleY(1)' },
    },
    '@keyframes slideout': {
        from: { transform: 'scaleY(1)' },
        to: { transform: 'scaleY(0)' },
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

const WidgetCollapsiblePlain = ({
    header,
    open,
    onOpen,
    onClose,
    color = colors.white,
    borderless = false,
    children,
    classes,
}: WidgetCollapsiblePropsPlain) => {
    const [childrenVisible, setChildrenVisibility] = useState(open); // controls whether children are rendered to the DOM
    const [animationsReady, setAnimationsReadyStatus] = useState(false);
    const [postEffectOpen, setPostEffectOpenStatus] = useState(open);
    const hideChildrenTimeoutRef = useRef(null);
    const initialRenderRef = useRef(true);

    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            return;
        }

        if (!animationsReady) {
            setAnimationsReadyStatus(true);
        }

        setPostEffectOpenStatus(open);

        clearTimeout(hideChildrenTimeoutRef.current);
        if (open) {
            setChildrenVisibility(true);
        } else {
            hideChildrenTimeoutRef.current = setTimeout(() => {
                setChildrenVisibility(false);
            }, 200);
        }
    }, [open, animationsReady]);

    return (
        <div style={{ backgroundColor: color, borderRadius: 3 }}>
            <div
                className={cx(classes.headerContainer, {
                    childrenVisible,
                    borderless,
                })}
            >
                <div className={classes.header}>
                    {header}
                    <IconButton
                        dataTest="widget-open-close-toggle-button"
                        className={cx(classes.toggleButton, {
                            closeinit: !animationsReady && !postEffectOpen,
                            open: animationsReady && postEffectOpen,
                            close: animationsReady && !postEffectOpen })}
                        onClick={open ? onClose : onOpen}
                    >
                        <IconChevronUp24 />
                    </IconButton>
                </div>
            </div>
            {
                childrenVisible ? (
                    <div
                        data-test="widget-contents"
                        className={cx(classes.children, {
                            open: animationsReady && open,
                            close: animationsReady && !open,
                            borderless,
                        })}
                    >
                        {children}
                    </div>
                ) : null
            }
        </div>
    );
};

export const WidgetCollapsible: ComponentType<WidgetCollapsibleProps> = withStyles(styles)(WidgetCollapsiblePlain);
