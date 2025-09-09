import React, { type ComponentType, type ReactNode } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { IconInfo16, colors } from '@dhis2/ui';

const styles: Readonly<any> = {
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
};

type InfoIconTextProps = {
    children: string | ReactNode;
};

type Props = InfoIconTextProps & WithStyles<typeof styles>;

const InfoIconTextPlain = ({ classes, children }: Props) => (
    <div className={classes.container}>
        <span className={classes.icon}>
            <IconInfo16 color={colors.grey800} />
        </span>
        <span className={classes.text}>
            {children}
        </span>
    </div>
);

export const InfoIconText = withStyles(styles)(InfoIconTextPlain) as ComponentType<InfoIconTextProps>;
