// @flow
import React, { type ComponentType, type Node } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Grid from '@material-ui/core/Grid';
import { colors } from '@dhis2/ui';

const InfoOutlinedIconWithStyles = withStyles({
    root: {
        fontSize: 14,
        color: colors.grey800,
        transformBox: 'view-box',
        position: 'relative',
        top: '2px',
    },
})(InfoOutlinedIcon);

type OwnProps = {| text: string | Node |}

const styles = () => ({
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


const InfoIconTextPlain = ({ classes, text }) => (
    <Grid container direction="row" alignItems="center" className={classes.container}>
        <Grid item>
            <InfoOutlinedIconWithStyles />
        </Grid>
        <Grid item className={classes.text}>
            {text}
        </Grid>
    </Grid>
);

export const InfoIconText: ComponentType<OwnProps> = withStyles(styles)(InfoIconTextPlain);
