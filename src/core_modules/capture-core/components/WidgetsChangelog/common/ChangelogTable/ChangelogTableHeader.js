// @flow
import i18n from '@dhis2/d2-i18n';
import { DataTableColumnHeader, DataTableHead, DataTableRow } from '@dhis2/ui';
import React from 'react';
import type { SetSortDirection, SortDirection } from '../Changelog/Changelog.types';

type Props = {
    sortDirection: SortDirection,
    setSortDirection: SetSortDirection,
};

export const ChangelogTableHeader = ({
    sortDirection,
    setSortDirection,
}: Props) => (
    <DataTableHead>
        <DataTableRow>
            <DataTableColumnHeader
                onSortIconClick={({ direction }) => setSortDirection(direction)}
                sortDirection={sortDirection}
            >
                {i18n.t('Date')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('User')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Data item')}
            </DataTableColumnHeader>
            <DataTableColumnHeader>
                {i18n.t('Change')}
            </DataTableColumnHeader>
        </DataTableRow>
    </DataTableHead>
);
