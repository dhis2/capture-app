// @flow
import React from 'react';
import {
    DataTableCell,
    IconMessages16,
} from '@dhis2/ui';
import { IconButton } from '../../../../../capture-ui';

type Props = {|
    showIcon: boolean,
|}

export const ManagementNotes = ({ showIcon }: Props) => {
    if (!showIcon) {
        return <DataTableCell />;
    }

    return (
        <DataTableCell align={'center'}>
            <IconButton onClick={() => {}}>
                <IconMessages16 />
            </IconButton>
        </DataTableCell>
    );
};
