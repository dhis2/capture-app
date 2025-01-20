// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DataTableColumnHeader, DataTableHead, DataTableRow } from '@dhis2/ui';
import { SORT_DIRECTIONS, SORT_TARGETS, CHANGELOG_ENTITY_TYPES } from '../Changelog/Changelog.constants';
import type { SortDirection } from '../Changelog/Changelog.types';

type Props = {
    columnToSortBy: string,
    sortDirection: SortDirection,
    setSortDirection: (SortDirection) => void,
    setColumnToSortBy: (column: string) => void,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
};

const getCurrentSortDirection = (
    columnName: string,
    currentColumn: string,
    currentDirection: SortDirection,
): SortDirection =>
    (columnName === currentColumn ? currentDirection : SORT_DIRECTIONS.DEFAULT);

export const ChangelogTableHeader = ({
    columnToSortBy,
    sortDirection,
    setSortDirection,
    setColumnToSortBy,
    entityType,
}: Props) => {
    const handleSortIconClick = ({ name, direction }) => {
        setSortDirection(direction);
        setColumnToSortBy(name);
    };

    const sortTargetDataItem = entityType === CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY
        ? SORT_TARGETS.ATTRIBUTE
        : SORT_TARGETS.DATA_ITEM;

    return (
        <DataTableHead>
            <DataTableRow>
                <DataTableColumnHeader
                    name={SORT_TARGETS.DATE}
                    sortDirection={getCurrentSortDirection(
                        SORT_TARGETS.DATE,
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
                    name={SORT_TARGETS.USERNAME}
                    sortDirection={getCurrentSortDirection(
                        SORT_TARGETS.USERNAME,
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
                    name={sortTargetDataItem}
                    sortDirection={getCurrentSortDirection(
                        sortTargetDataItem,
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
