import React, { type ComponentType, useEffect, useRef, useState } from 'react';
import { WithStyles, withStyles } from 'capture-core-utils/styles';
import { cx } from '@emotion/css';
import { colors, spacers, IconChevronUp24, IconChevronDown24, spacersNum } from '@dhis2/ui';
import { IconButton } from 'capture-ui';
import type { WidgetCollapsiblePropsPlain } from './widgetCollapsible.types';

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
        padding: `${spacers.dp8} ${spacers.dp8} ${spacers.dp8} ${spacers.dp12}`,
        fontWeight: 500,
        fontSize: 15,
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
        marginInlineStart: spacersNum.dp4,
        height: '24px',
        borderRadius: '3px',
        color: colors.grey600,
        '&:hover': {
            background: colors.grey200,
            color: colors.grey800,
        },
        '&:focus:not(:focus-visible)': {
            outline: 'none',
        },
        '&:focus-visible': {
            outline: '2px solid',
            outlineColor: colors.grey800,
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
};

type Props = WidgetCollapsiblePropsPlain & WithStyles<typeof styles>;

const WidgetCollapsiblePlain = ({
    header,
    open,
    onOpen,
    onClose,
    color = colors.white,
    borderless = false,
    children,
    classes,
}: Props) => {
    const [childrenVisible, setChildrenVisibility] = useState(open); // controls whether children are rendered to the DOM
    const [animationsReady, setAnimationsReadyStatus] = useState(false);
    const hideChildrenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialRenderRef = useRef(true);

    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            return;
        }

        if (!animationsReady) {
            setAnimationsReadyStatus(true);
        }

        clearTimeout(hideChildrenTimeoutRef.current as ReturnType<typeof setTimeout>);
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
                        className={classes.toggleButton}
                        onClick={open ? onClose : onOpen}
                    >
                        {open ? <IconChevronUp24 /> : <IconChevronDown24 />}
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

export const WidgetCollapsible = withStyles(styles)(WidgetCollapsiblePlain) as ComponentType<WidgetCollapsiblePropsPlain>;
