import React from 'react';
import { BulkActionBarComponent } from './BulkActionBar.component';
import type { ContainerProps } from './BulkActionBar.types';

export const BulkActionBar = ({
    onClearSelection,
    selectedRowsCount,
    children,
}: ContainerProps) => (
    <BulkActionBarComponent
        selectedRowsCount={selectedRowsCount}
        onClearSelection={onClearSelection}
    >
        {children}
    </BulkActionBarComponent>
);
