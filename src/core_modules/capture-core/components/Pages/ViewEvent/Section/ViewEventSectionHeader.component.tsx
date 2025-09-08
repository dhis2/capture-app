import * as React from 'react';
import classNames from 'classnames';
import { Chip, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';


const getStyles = (theme: any) => ({
    eaderContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    headerItemContainer: {
        display: 'inline-flex',
        paddingRight: theme.typography.pxToRem(5),
        paddingLeft: theme.typography.pxToRem(5),
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'default !important',
        backgroundColor: `${colors.grey300} !important`,
    },
});

type Props = {
    icon: React.ComponentType<any>,
    text: string,
    badgeCount: number,
}


class ViewEventSectionHeaderPlain extends React.Component<Props & WithStyles<typeof getStyles>> {
    render() {
        const { icon: Icon, text, badgeCount, classes, badgeClass } = this.props as any;
        const shouldRenderBadge = !!badgeCount || badgeCount === 0;
        return (
            <div className={classes.headerContainer}>
                <div className={classes.headerItemContainer}>
                    <Icon />
                </div>
                <div className={classes.headerItemContainer}>
                    {text}
                </div>
                {shouldRenderBadge &&
                    <div className={classes.headerItemContainer}>
                        <Chip dense className={classNames(classes.badge, badgeClass)}>
                            {badgeCount}
                        </Chip>
                    </div>
                }
            </div>
        );
    }
}


export const ViewEventSectionHeader = withStyles(getStyles)(ViewEventSectionHeaderPlain);
