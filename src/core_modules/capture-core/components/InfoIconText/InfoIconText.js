// @flow
import React, { type ComponentType, type Node } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { IconInfo16, colors } from '@dhis2/ui';
import Grid from '@material-ui/core/Grid';


type OwnProps = {| children: string | Node |}

const styles = () => ({
    icon: {
        position: 'relative',
        top: 1,
    },
    container: {
        marginTop: 12,
        marginBottom: 12,
    },
    text: {
        fontSize: 14,
        fontWeight: 'normal',
        color: colors.grey800,
        marginLeft: 6,
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
