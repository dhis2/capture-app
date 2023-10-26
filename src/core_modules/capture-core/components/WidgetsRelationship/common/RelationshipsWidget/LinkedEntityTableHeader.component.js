// @flow
import React from 'react';
import {
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
} from '@dhis2/ui';
import type { Props } from './linkedEntityTableHeader.types';

export const LinkedEntityTableHeader = ({ columns }: Props) => (
    <DataTableHead>
        <DataTableRow>
            {
                columns
                    .map(({ id, displayName }) => (
                        <DataTableColumnHeader
                            key={id}
                        >
                            {displayName}
                        </DataTableColumnHeader>
                    ))
            }
        </DataTableRow>
    </DataTableHead>
);
