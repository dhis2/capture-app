// @flow
import React from 'react';
import { DataTableCell, Tag } from '@dhis2/ui';
import { ManagementStatuses } from '../WidgetManagement.const';

type Props = {|
    status: ?string
|}

export const ManagementStatus = ({ status }: Props) => {
    if (!status) {
        return <DataTableCell />;
    }

    const lowerCaseStatus = status.toLowerCase();
    const statusStringFromObject = ManagementStatuses[lowerCaseStatus];

    return (
        <DataTableCell>
            <Tag
                neutral={statusStringFromObject === ManagementStatuses.open}
                positive={statusStringFromObject === ManagementStatuses.performed}
                negative={statusStringFromObject === ManagementStatuses.notperformed}
            >
                {statusStringFromObject}
            </Tag>
        </DataTableCell>
    );
};
