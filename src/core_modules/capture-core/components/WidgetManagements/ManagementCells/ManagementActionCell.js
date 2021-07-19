// @flow
import React from 'react';
import { DataTableCell, IconMore24 } from '@dhis2/ui';
import { IconButton } from '../../../../capture-ui';

export const ManagementActionCell = () => (
    <DataTableCell width={'5%'} align={'center'}>
        <IconButton onClick={() => {}} style={{ transform: 'rotate(90deg)' }}>
            <IconMore24 />
        </IconButton>
    </DataTableCell>
);
