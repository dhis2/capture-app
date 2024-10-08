// @flow
import i18n from '@dhis2/d2-i18n';
import { DataTableColumnHeader, DataTableHead, DataTableRow } from '@dhis2/ui';
import React from 'react';
import type { SetSortDirection, SortDirection } from '../Changelog/Changelog.types';

type Props = {
    sortDirection: SortDirection,
    setSortDirection: SetSortDirection,
};

export const ChangelogTableHeader = ({ sortDirection, setSortDirection }: Props) => (
    <DataTableHead>
        <DataTableRow>
            <DataTableColumnHeader
                fixed
                top="0"
                onSortIconClick={({ direction }) => setSortDirection(direction)}
                sortDirection={sortDirection}
            >
                {i18n.t('Date')}
            </DataTableColumnHeader>
            {['User', 'Data item', 'Change', 'Value'].map(header => (
                <DataTableColumnHeader key={header} fixed top="0">
                    {i18n.t(header)}
                </DataTableColumnHeader>
            ))}
        </DataTableRow>
    </DataTableHead>
);
