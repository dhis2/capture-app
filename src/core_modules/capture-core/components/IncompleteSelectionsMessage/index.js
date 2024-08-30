import React from 'react';
import Paper from '@material-ui/core/Paper/Paper';
import { withStyles } from '@material-ui/core';
import { colors } from '@dhis2/ui';

const StyledPaper = withStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.grey200,
        color: colors.grey700,
        padding: '12px 16px',
    },
})(Paper);

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
};

export const IncompleteSelectionsMessage = ({ children, dataTest = 'informative-paper' }) => (
    <div style={containerStyle}>
        <StyledPaper data-test={dataTest} elevation={0}>
            {children}
        </StyledPaper>
    </div>
);
