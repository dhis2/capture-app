import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import React from 'react';

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

export const IncompleteSelectionsMessage = ({ children, dataTest = 'informative-paper' }) => (
    <Grid container justify="center">
        <Grid item>
            <StyledPaper
                data-test={dataTest}
                elevation={0}
            >
                {children}
            </StyledPaper>
        </Grid>
    </Grid>);

