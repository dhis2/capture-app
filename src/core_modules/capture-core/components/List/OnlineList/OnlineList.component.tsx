import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    CheckboxField,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
} from '@dhis2/ui';
import classNames from 'classnames';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { ReactNode } from 'react';
import type { OptionSet } from '../../../metaData';
import { dataElementTypes } from '../../../metaData';

const getStyles: Readonly<any> = {
    tableContainer: {
        overflowX: 'auto',
    },
    loadingRow: {
        height: 100,
    },
    headerAlign: {
        '&>span.container': {
            alignItems: 'flex-end',
        },
    },
};

export type Column = {
    id: string;
    header: string;
    visible: boolean;
    type: keyof typeof dataElementTypes;
    optionSet?: OptionSet | null;
    sortDisabled?: boolean;
};

type Props = {
    dataSource: Array<any>;
    rowIdKey: string;
    columns: Array<Column> | null;
    selectedRows: { [key: string]: boolean };
    onSelectAll: (ids: Array<string>) => void;
    onRowSelect: (id: string) => void;
    allRowsAreSelected: boolean;
    isSelectionInProgress: boolean;
    sortById: string;
    showSelectCheckBox: boolean | null;
    sortByDirection: string;
    onSort: (id: string, direction: string) => void;
    updating?: boolean;
    getCustomEndCellHeader?: (props: Props) => ReactNode;
    onRowClick: (rowData: any) => void;
    getCustomEndCellBody?: (row: any, props: Props) => ReactNode;
    customEndCellHeaderStyle?: any;
    customEndCellBodyStyle?: any;
} & WithStyles<typeof getStyles>;

class Index extends React.Component<Props> {
    getSortHandler =
        (id: string) =>
            ({ direction }: { direction: string }) => {
                this.props.onSort(id, direction);
            };

    getCustomEndCellHeader = () => {
        const { getCustomEndCellHeader, getCustomEndCellBody } = this.props;

        return getCustomEndCellBody ? (
            <DataTableColumnHeader>
                {getCustomEndCellHeader && getCustomEndCellHeader(this.props)}
            </DataTableColumnHeader>
        ) : null;
    };

    getCustomEndCellBody = (row: any, customEndCellBodyProps: any) => {
        const { getCustomEndCellBody } = this.props;

        return getCustomEndCellBody ? (
            <DataTableCell>
                {getCustomEndCellBody(row, customEndCellBodyProps)}
            </DataTableCell>
        ) : null;
    };

    static typesWithRightPlacement = [
        dataElementTypes.NUMBER,
        dataElementTypes.INTEGER,
        dataElementTypes.INTEGER_POSITIVE,
        dataElementTypes.INTEGER_NEGATIVE,
        dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];

    renderHeaderRow(visibleColumns: Column[]) {
        const { classes, sortById, sortByDirection, dataSource, onSelectAll, allRowsAreSelected } = this.props;

        const getSortDirection = (column: Column): 'asc' | 'desc' | 'default' | undefined => {
            if (column.sortDisabled) {
                return undefined;
            }
            return sortById === column.id ? (sortByDirection as 'asc' | 'desc') : 'default';
        };

        const headerCells = visibleColumns.map((column: any) => (
            <DataTableColumnHeader
                dataTest={`table-row-${sortById === column.id ? sortByDirection : 'default'}`}
                onSortIconClick={this.getSortHandler(column.id)}
                sortDirection={getSortDirection(column)}
                key={column.id}
                align={Index.typesWithRightPlacement.includes(column.type) ? 'right' : 'left'}
                className={classNames({ [classes.headerAlign]: Index.typesWithRightPlacement.includes(column.type) })}
            >
                {column.header}
            </DataTableColumnHeader>
        ));

        const checkboxCell = this.props.showSelectCheckBox ? (
            <DataTableColumnHeader
                dataTest={'select-all-rows-checkbox'}
            >
                <CheckboxField
                    checked={allRowsAreSelected}
                    onChange={() => onSelectAll(dataSource.map((item: any) => item.id))}
                />
            </DataTableColumnHeader>
        ) : null;

        return (
            <DataTableRow dataTest="table-row">
                {checkboxCell}
                {headerCells}
                {this.getCustomEndCellHeader()}
            </DataTableRow>
        );
    }

    renderBody(visibleColumns: Column[]) {
        const { updating, classes } = this.props;
        const columnsCount = visibleColumns.length + (this.props.getCustomEndCellBody ? 1 : 0);

        return updating ? (
            <DataTableRow className={classes.loadingRow} dataTest="working-list-table-loading" />
        ) : (
            this.renderRows(visibleColumns, columnsCount)
        );
    }

    renderRows(visibleColumns: Column[], columnsCount: number) {
        const { dataSource, rowIdKey, selectedRows, onRowSelect, ...customEndCellBodyProps } = this.props;

        if (!dataSource || dataSource.length === 0) {
            return (
                <DataTableRow dataTest="table-row">
                    <DataTableCell colSpan={columnsCount.toString()}>{i18n.t('No items to display')}</DataTableCell>
                </DataTableRow>
            );
        }

        return dataSource.map((row) => {
            const cells = visibleColumns.map((column: any) => (
                <DataTableCell
                    key={column.id}
                    align={Index.typesWithRightPlacement.includes(column.type) ? 'right' : 'left'}
                    style={{ cursor: this.props.isSelectionInProgress ? 'pointer' : 'default' }}
                    onClick={() => {
                        if (this.props.isSelectionInProgress) {
                            onRowSelect(row[rowIdKey]);
                            return;
                        }
                        this.props.onRowClick(row);
                    }}
                >
                    {row[column.id]}
                </DataTableCell>
            ));

            const rowId = row[rowIdKey];
            return (
                <DataTableRow
                    selected={selectedRows[rowId]}
                    key={rowId}
                    dataTest={row[rowIdKey]}
                >
                    {this.props.showSelectCheckBox && (
                        <DataTableCell
                            width={'40px'}
                        >
                            <CheckboxField
                                dataTest={'select-row-checkbox'}
                                checked={selectedRows[rowId]}
                                onChange={() => onRowSelect(rowId)}
                            />
                        </DataTableCell>
                    )}
                    {cells}
                    {this.getCustomEndCellBody(row, customEndCellBodyProps)}
                </DataTableRow>
            );
        });
    }

    render() {
        const { classes, columns, updating } = this.props;
        const visibleColumns = columns ? columns.filter(column => column.visible) : [];
        return (
            <div className={classes.tableContainer}>
                <DataTable dataTest="online-list-table">
                    <DataTableHead>{this.renderHeaderRow(visibleColumns)}</DataTableHead>
                    <DataTableBody loading={Boolean(updating)}>{this.renderBody(visibleColumns)}</DataTableBody>
                </DataTable>
            </div>
        );
    }
}

export const OnlineList = withStyles(getStyles as any)(Index);
