// @flow
import React from 'react';
import { DataTableCell, IconMessages16 } from '@dhis2/ui';

type Props = {|
    showIcon: boolean,
|}

export const ManagementNotes = ({ showIcon }: Props) => {
    if (!showIcon) {
        return <DataTableCell />;
    }

    return (
        <DataTableCell align={'center'} width={'5%'}>
            <span style={{ cursor: 'pointer' }}>
                <IconMessages16 />
            </span>
        </DataTableCell>
    );
};
