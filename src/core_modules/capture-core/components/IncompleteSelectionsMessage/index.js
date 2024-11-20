import React from 'react';
import { colors } from '@dhis2/ui';

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
};

const messageBoxStyle = {
    alignItems: 'center',
    background: colors.grey200,
    color: colors.grey700,
    padding: '12px 16px',
    borderRadius: '4px',
};

export const IncompleteSelectionsMessage = ({ children, dataTest = 'informative-paper' }) => (
    <div style={containerStyle}>
        <div style={messageBoxStyle} data-test={dataTest}>
            {children}
        </div>
    </div>
);
