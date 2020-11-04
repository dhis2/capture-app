import React from 'react';
import Paper from '@material-ui/core/Paper/Paper';
import Grid from '@material-ui/core/Grid/Grid';
import { withStyles } from '@material-ui/core';
import { colors } from '@dhis2/ui';

const StyledPaper = withStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.grey300,
        color: colors.grey700,
        padding: '12px 16px',
    },
})(Paper);

export const InefficientSelectionsMessage = ({ message, dataTest = 'dhis2-capture-informative-paper' }) => (
    <Grid container justify="center">
        <Grid item>
            <StyledPaper
                data-test={dataTest}
                elevation={0}
            >
                {message}
            </StyledPaper>
        </Grid>
    </Grid>);

