import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { IconButton } from 'capture-ui';
import cx from 'classnames';
import { IconChevronUp24, colors, spacersNum } from '@dhis2/ui';

const getStyles = (theme: any) => ({
    container: {
        background: colors.white,
        border: '1px solid',
        borderColor: colors.grey400,
        borderRadius: 3,
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.typography.pxToRem(5),
        minHeight: theme.typography.pxToRem(42),
    },
    toggleCollapseButton: {
        padding: 4,
    },
    children: {
        padding: theme.typography.pxToRem(10),
        borderTop: `1px solid ${theme.palette.grey.blueGrey}`,
        '&.open': {
            animation: 'slidein 200ms normal forwards ease-in-out',
            transformOrigin: '50% 0%',
        },
        '&.close': {
            animation: 'slideout 200ms normal forwards ease-in-out',
            transformOrigin: '100% 0%',
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
}) as const;

type Props = {
    header: ReactNode,
    children: ReactNode,
    collapsable?: boolean,
    collapsed?: boolean,
};

const ViewEventSectionPlain = ({
    header,
    collapsable = false,
    collapsed: propsCollapsed = false,
    children,
    classes,
}: Props & WithStyles<typeof getStyles>) => {
    const [collapsed, setCollapsed] = useState(propsCollapsed);
    const [childrenVisible, setChildrenVisibility] = useState(!propsCollapsed);
    const [animationsReady, setAnimationsReadyStatus] = useState(false);
    const hideChildrenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialRenderRef = useRef(true);

    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
            setAnimationsReadyStatus(false);
            return;
        }

        setAnimationsReadyStatus(true);

        if (!collapsed) {
            setChildrenVisibility(true);
        } else {
            hideChildrenTimeoutRef.current = setTimeout(() => {
                setChildrenVisibility(false);
            }, 200);
        }
    }, [collapsed]);


    const toggleCollapse = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <div className={classes.container}>
            <div className={classes.headerContainer}>
                {header}
                {collapsable && (
                    <IconButton
                        className={cx(classes.toggleButton, {
                            closeinit: !animationsReady && collapsed,
                            open: animationsReady && !collapsed,
                            close: animationsReady && collapsed,
                        })}
                        onClick={toggleCollapse}
                    >
                        <IconChevronUp24 />
                    </IconButton>
                )}
            </div>
            {childrenVisible && (
                <div
                    className={cx(classes.children, {
                        open: animationsReady && !collapsed,
                        close: animationsReady && collapsed,
                    })}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export const ViewEventSection = withStyles(getStyles)(ViewEventSectionPlain);
