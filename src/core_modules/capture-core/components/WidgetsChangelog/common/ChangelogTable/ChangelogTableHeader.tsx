import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
} from '@dhis2/ui';
import {
    SORT_DIRECTIONS,
    SORT_TARGETS,
    CHANGELOG_ENTITY_TYPES,
} from '../Changelog/Changelog.constants';
import type { SortDirection } from '../Changelog/Changelog.types';

type Props = {
    columnToSortBy: string;
    sortDirection: SortDirection;
    setSortDirection: (direction: SortDirection) => void;
    setColumnToSortBy: (column: string) => void;
    entityType: typeof CHANGELOG_ENTITY_TYPES[keyof typeof CHANGELOG_ENTITY_TYPES];
    supportsChangelogV2: boolean;
};

type ColumnConfig = {
    label: string;
    width: string;
    isSortable: boolean;
    name?: string;
    sortIconTitle?: string;
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
    supportsChangelogV2,
}: Props) => {
    const handleSortIconClick = ({ name, direction }: { name: string; direction: SortDirection }) => {
        setSortDirection(direction);
        setColumnToSortBy(name);
    };

    const sortTargetDataItem = entityType === CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY
        ? SORT_TARGETS.ATTRIBUTE
        : SORT_TARGETS.DATA_ITEM;

    const columns: Array<ColumnConfig> = [
        {
            name: SORT_TARGETS.DATE,
            label: i18n.t('Date') as string,
            sortIconTitle: i18n.t('Sort by date') as string,
            width: '140px',
            isSortable: true,
        },
        {
            name: SORT_TARGETS.USERNAME,
            label: i18n.t('User') as string,
            sortIconTitle: i18n.t('Sort by username') as string,
            width: '125px',
            isSortable: supportsChangelogV2,
        },
        {
            name: sortTargetDataItem,
            label: i18n.t('Data item') as string,
            sortIconTitle: i18n.t('Sort by data item') as string,
            width: '125px',
            isSortable: supportsChangelogV2,
        },
        {
            label: i18n.t('Change') as string,
            width: '85px',
            isSortable: false,
        },
        {
            label: i18n.t('Value') as string,
            width: '275px',
            isSortable: false,
        },
    ];

    return (
        <DataTableHead>
            <DataTableRow>
                {columns.map(({
                    name,
                    label,
                    sortIconTitle,
                    width,
                    isSortable,
                }) => (
                    <DataTableColumnHeader
                        key={label}
                        width={width}
                        name={isSortable ? name : undefined}
                        sortDirection={
                            isSortable && name
                                ? getCurrentSortDirection(name, columnToSortBy, sortDirection)
                                : undefined
                        }
                        onSortIconClick={
                            isSortable && name
                                ? handleSortIconClick as any
                                : undefined
                        }
                        sortIconTitle={isSortable ? sortIconTitle : undefined}
                    >
                        {label}
                    </DataTableColumnHeader>
                ))}
            </DataTableRow>
        </DataTableHead>
    );
};
