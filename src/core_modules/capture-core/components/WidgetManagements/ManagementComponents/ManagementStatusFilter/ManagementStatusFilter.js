// @flow
import React from 'react';
import { Chip } from '@dhis2/ui';
import { ManagementStatuses, TranslatedManagementStatuses } from '../../WidgetManagement.const';

type Props = {|
    filterStatus: string,
    handleFilterChange: (string) => void,
|}

export const ManagementStatusFilter = ({ filterStatus, handleFilterChange }: Props) => (
    <div>
        <Chip
            selected={filterStatus === ManagementStatuses.open}
            onClick={() => handleFilterChange(ManagementStatuses.open)}
        >
            {TranslatedManagementStatuses.open}
        </Chip>
        <Chip
            selected={filterStatus === ManagementStatuses.performed}
            onClick={() => handleFilterChange(ManagementStatuses.performed)}
        >
            {TranslatedManagementStatuses.performed}
        </Chip>
        <Chip
            selected={filterStatus === ManagementStatuses.notperformed}
            onClick={() => handleFilterChange(ManagementStatuses.notperformed)}
        >
            {TranslatedManagementStatuses.notperformed}
        </Chip>
    </div>
);
