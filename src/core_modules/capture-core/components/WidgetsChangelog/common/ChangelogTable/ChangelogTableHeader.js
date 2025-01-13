// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DataTableColumnHeader, DataTableHead, DataTableRow } from '@dhis2/ui';
import { SORT_DIRECTION, COLUMN_TO_SORT_BY } from '../Changelog/Changelog.constants';
import type { SortDirection } from '../Changelog/Changelog.types';

type Props = {
    columnToSortBy: string,
    sortDirection: SortDirection,
    setSortDirection: (SortDirection) => void,
    setColumnToSortBy: (column: string) => void,
};

const getCurrentSortDirection = (
    columnName: string,
    currentColumn: string,
    currentDirection: SortDirection,
): SortDirection =>
    (columnName === currentColumn ? currentDirection : SORT_DIRECTION.DEFAULT);

export const ChangelogTableHeader = ({
    columnToSortBy,
    sortDirection,
    setSortDirection,
    setColumnToSortBy,
}: Props) => {
    const handleSortIconClick = ({ name, direction }) => {
        setSortDirection(direction);
        setColumnToSortBy(name);
    };

    return (
        <DataTableHead>
            <DataTableRow>
                <DataTableColumnHeader
                    name={COLUMN_TO_SORT_BY.DATE}
                    sortDirection={getCurrentSortDirection(
                        COLUMN_TO_SORT_BY.DATE,
                        columnToSortBy,
                        sortDirection,
                    )}
                    onSortIconClick={handleSortIconClick}
                    sortIconTitle={i18n.t('Sort by date')}
                    fixed
                    top="0"
                    width="140px"
                >
                    {i18n.t('Date')}
                </DataTableColumnHeader>

                <DataTableColumnHeader
                    name={COLUMN_TO_SORT_BY.USERNAME}
                    sortDirection={getCurrentSortDirection(
                        COLUMN_TO_SORT_BY.USERNAME,
                        columnToSortBy,
                        sortDirection,
                    )}
                    onSortIconClick={handleSortIconClick}
                    sortIconTitle={i18n.t('Sort by username')}
                    fixed
                    top="0"
                    width="125px"
                >
                    {i18n.t('User')}
                </DataTableColumnHeader>

                <DataTableColumnHeader
                    name={COLUMN_TO_SORT_BY.DATA_ITEM}
                    sortDirection={getCurrentSortDirection(
                        COLUMN_TO_SORT_BY.DATA_ITEM,
                        columnToSortBy,
                        sortDirection,
                    )}
                    onSortIconClick={handleSortIconClick}
                    sortIconTitle={i18n.t('Sort by data item')}
                    fixed
                    top="0"
                    width="125px"
                >
                    {i18n.t('Data item')}
                </DataTableColumnHeader>

                <DataTableColumnHeader fixed top="0" width="85px">
                    {i18n.t('Change')}
                </DataTableColumnHeader>

                <DataTableColumnHeader fixed top="0" width="275px">
                    {i18n.t('Value')}
                </DataTableColumnHeader>
            </DataTableRow>
        </DataTableHead>
    );
};
