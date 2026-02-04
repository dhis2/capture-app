import React from 'react';
import { cx } from '@emotion/css';
import { Chip, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

const getStyles = (theme: any) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        paddingInline: theme.typography.pxToRem(5),
    },
    iconAndText: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.typography.pxToRem(8),
    },
    badgeContainer: {
        display: 'inline-flex',
        paddingInline: theme.typography.pxToRem(5),
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'default !important',
        backgroundColor: `${colors.grey300} !important`,
    },
});

type Props = {
    icon: React.ComponentType;
    text: string;
    badgeCount?: number;
    badgeClass?: string;
};

type ComponentProps = Props & WithStyles<typeof getStyles>;

const ViewEventSectionHeaderPlain = ({ icon: Icon, text, badgeCount, classes, badgeClass }: ComponentProps) => {
    const shouldRenderBadge = !!badgeCount || badgeCount === 0;

    return (
        <div className={classes.container}>
            <div className={classes.iconAndText}>
                <Icon />
                {text}
            </div>
            {shouldRenderBadge && (
                <div className={classes.badgeContainer}>
                    <Chip dense className={cx(classes.badge, badgeClass)}>
                        {badgeCount}
                    </Chip>
                </div>
            )}
        </div>
    );
};

export const ViewEventSectionHeader = withStyles(getStyles)(ViewEventSectionHeaderPlain);
