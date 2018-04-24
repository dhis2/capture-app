import React from 'react';
import { withStyles } from 'material-ui-next/styles';
import Paper from 'material-ui-next/Paper';
import Grid from 'material-ui-next/Grid';

import ProgramSelector from 'capture-core/components/QuickSelector/ProgramSelector.component';
import OrgUnitSelector from 'capture-core/components/QuickSelector/OrgUnitSelector.component';
import ActionButtons from 'capture-core/components/QuickSelector/ActionButtons.component';


const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: 10,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

function FullWidthGrid(props) {
    const { classes } = props;

    return (
        <Paper className={classes.root}>
            <Grid container spacing={24}>
                <Grid item xs={12} sm={4}>
                    <ProgramSelector />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <OrgUnitSelector />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <ActionButtons />
                </Grid>
            </Grid>
        </Paper>
    );
}

export default withStyles(styles)(FullWidthGrid);
