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
                onSortIconClick={({ direction }) => setSortDirection(direction)}
                sortDirection={sortDirection}
                fixed
                top="0"
                width="140px"
            >
                {i18n.t('Date')}
            </DataTableColumnHeader>
            <DataTableColumnHeader fixed top="0" width="125px">
                {i18n.t('User')}
            </DataTableColumnHeader>
            <DataTableColumnHeader fixed top="0" width="125px">
                {i18n.t('Data item')}
            </DataTableColumnHeader>
            <DataTableColumnHeader fixed top="0" width="85px">
                {i18n.t('Change')}
            </DataTableColumnHeader>
            <DataTableColumnHeader fixed top="0">
                {i18n.t('Value')}
            </DataTableColumnHeader>
        </DataTableRow>
    </DataTableHead>
);
