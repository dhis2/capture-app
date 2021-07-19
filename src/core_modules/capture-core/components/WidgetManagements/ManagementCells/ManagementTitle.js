// @flow
import React from 'react';
import { DataTableCell } from '@dhis2/ui';

type Props = {|
    displayName: string,
    reason?: ?string,
    performed: boolean,
|}

export const ManagementTitle = ({ displayName, reason, performed }: Props) => (
    <DataTableCell muted={performed}>
        <p style={{ margin: '3px 0' }}>{displayName}</p>
        {!performed && (
            <span style={{ color: '#9e9a9a' }}>{reason}</span>
        )}
    </DataTableCell>
);
