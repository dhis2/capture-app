// @flow
import { IconInfo16, colors } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { type ComponentType, type Node } from 'react';


type OwnProps = {| children: string | Node |}

const styles = () => ({
    icon: {
        position: 'relative',
        top: '2px',
    },
    container: {
        marginTop: 12,
        marginBottom: 12,
    },
    text: {
        fontSize: 14,
        fontWeight: 'normal',
        marginLeft: 8,
        color: colors.grey800,
    },
});


const InfoIconTextPlain = ({ classes, children }) => (
    <Grid container direction="row" alignItems="center" className={classes.container}>
        <Grid item>
            <span className={classes.icon}>
                <IconInfo16 color={colors.grey800} />
            </span>
        </Grid>
        <Grid item className={classes.text}>
            {children}
        </Grid>
    </Grid>
);

export const InfoIconText: ComponentType<OwnProps> = withStyles(styles)(InfoIconTextPlain);
