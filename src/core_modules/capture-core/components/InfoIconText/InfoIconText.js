// @flow
import React, { type ComponentType, type Node } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { IconInfo16, colors } from '@dhis2/ui';

type OwnProps = {| children: string | Node |}

const styles = () => ({
    icon: {
        position: 'relative',
        top: 1,
    },
    container: {
        marginTop: 12,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: 'normal',
        color: colors.grey800,
        marginLeft: 6,
    },
});

const InfoIconTextPlain = ({ classes, children }) => (
    <div className={classes.container}>
        <span className={classes.icon}>
            <IconInfo16 color={colors.grey800} />
        </span>
        <span className={classes.text}>
            {children}
        </span>
    </div>
);

export const InfoIconText: ComponentType<OwnProps> = withStyles(styles)(InfoIconTextPlain);
