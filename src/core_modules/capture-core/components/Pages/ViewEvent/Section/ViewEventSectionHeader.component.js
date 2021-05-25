
// @flow
import * as React from 'react';
import classNames from 'classnames';

import { Chip, withStyles } from '@material-ui/core';


const getStyles = (theme: Theme) => ({
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    headerItemContainer: {
        display: 'inline-flex',
        paddingRight: theme.typography.pxToRem(5),
        paddingLeft: theme.typography.pxToRem(5),
    },
    badge: {
        height: theme.typography.pxToRem(20),
        width: theme.typography.pxToRem(20),
        fontWeight: 700,
    },
});

type Props = {
    icon: React.ComponentType<any>,
    text: string,
    badgeCount: number,
}


class ViewEventSectionHeaderPlain extends React.Component<Props> {
    render() {
        // $FlowFixMe[prop-missing] automated comment
        const { icon: Icon, text, badgeCount, classes, badgeClass } = this.props;
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
                        <Chip className={classNames(classes.badge, badgeClass)} label={badgeCount} />
                    </div>
                }
            </div>
        );
    }
}


export const ViewEventSectionHeader = withStyles(getStyles)(ViewEventSectionHeaderPlain);
