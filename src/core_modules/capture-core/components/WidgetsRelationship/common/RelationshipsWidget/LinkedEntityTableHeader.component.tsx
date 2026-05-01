import React from 'react';
import {
    DataTableHead,
    DataTableRow,
    DataTableColumnHeader,
} from '@dhis2/ui';
import type { Props } from './linkedEntityTableHeader.types';

export const LinkedEntityTableHeader = ({ columns, context, readOnly }: Props) => (
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
            {context.display.showDeleteButton && !readOnly ? (
                <DataTableColumnHeader />
            ) : null}
        </DataTableRow>
    </DataTableHead>
);
