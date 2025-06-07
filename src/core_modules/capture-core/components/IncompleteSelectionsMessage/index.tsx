import React from 'react';
import { colors } from '@dhis2/ui';
import type { ReactNode } from 'react';

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

type Props = {
    children: ReactNode;
    dataTest?: string;
};

export const IncompleteSelectionsMessage = ({ children, dataTest = 'informative-paper' }: Props) => (
    <div style={containerStyle}>
        <div style={messageBoxStyle} data-test={dataTest}>
            {children}
        </div>
    </div>
);
