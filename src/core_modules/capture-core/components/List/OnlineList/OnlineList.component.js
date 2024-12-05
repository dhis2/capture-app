// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DataTableHead, DataTable, DataTableBody, DataTableRow, DataTableCell, DataTableColumnHeader } from '@dhis2/ui';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { dataElementTypes } from '../../../metaData';
import type { OptionSet } from '../../../metaData';

const getStyles = () => ({
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
});

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Keys<typeof dataElementTypes>,
    optionSet?: ?OptionSet,
};

type Props = {
    dataSource: Array<Object>,
    rowIdKey: string,
    columns: ?Array<Column>,
    sortById: string,
    sortByDirection: string,
    onSort: (id: string, direction: string) => void,
    updating?: ?boolean,
    getCustomEndCellHeader: (props: Props) => React.Node,
    onRowClick: (rowData: Object) => void,
    getCustomEndCellBody: (row: Object, props: Props) => React.Node,
    customEndCellHeaderStyle?: ?Object,
    customEndCellBodyStyle?: ?Object,
    classes: {
        tableContainer: string,
        loadingRow: string,
        headerAlign: string,
    },
};

class Index extends React.Component<Props> {
    static typesWithRightPlacement = [
        dataElementTypes.NUMBER,
        dataElementTypes.INTEGER,
        dataElementTypes.INTEGER_POSITIVE,
        dataElementTypes.INTEGER_NEGATIVE,
        dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];

    getSortHandler =
        (id: string) =>
            ({ direction }: { direction: string }) => {
                this.props.onSort(id, direction);
            };

    getCustomEndCellHeader = () => {
        const { getCustomEndCellHeader, getCustomEndCellBody, customEndCellHeaderStyle } = this.props;

        return getCustomEndCellBody ? (
            <DataTableColumnHeader style={customEndCellHeaderStyle}>
                {getCustomEndCellHeader && getCustomEndCellHeader(this.props)}
            </DataTableColumnHeader>
        ) : null;
    };

    getCustomEndCellBody = (row: Object, customEndCellBodyProps: Object) => {
        const { getCustomEndCellBody, customEndCellBodyStyle } = this.props;

        return getCustomEndCellBody ? (
            <DataTableCell style={customEndCellBodyStyle}>
                {getCustomEndCellBody(row, customEndCellBodyProps)}
            </DataTableCell>
        ) : null;
    };

    renderHeaderRow(visibleColumns: Array<Column>) {
        const { classes, sortById, sortByDirection } = this.props;

        const headerCells = visibleColumns.map(column => (
            <DataTableColumnHeader
                dataTest={`table-row-${sortById === column.id ? sortByDirection : 'default'}`}
                onSortIconClick={this.getSortHandler(column.id)}
                sortDirection={sortById === column.id ? sortByDirection : 'default'}
                key={column.id}
                align={Index.typesWithRightPlacement.includes(column.type) ? 'right' : 'left'}
                className={classNames({ [classes.headerAlign]: Index.typesWithRightPlacement.includes(column.type) })}
            >
                {column.header}
            </DataTableColumnHeader>
        ));

        return (
            <DataTableRow dataTest="table-row">
                {headerCells}
                {this.getCustomEndCellHeader()}
            </DataTableRow>
        );
    }

    renderBody(visibleColumns: Array<Column>) {
        const { getCustomEndCellBody, updating, classes } = this.props;
        const columnsCount = visibleColumns.length + (getCustomEndCellBody ? 1 : 0);

        return updating ? (
            <DataTableRow className={classes.loadingRow} />
        ) : (
            this.renderRows(visibleColumns, columnsCount)
        );
    }

    renderRows(visibleColumns: Array<Column>, columnsCount: number) {
        const { dataSource, rowIdKey, ...customEndCellBodyProps } = this.props;

        if (!dataSource || dataSource.length === 0) {
            return (
                <DataTableRow dataTest="table-row">
                    <DataTableCell colSpan={columnsCount}>{i18n.t('No items to display')}</DataTableCell>
                </DataTableRow>
            );
        }

        return dataSource.map((row) => {
            const cells = visibleColumns.map(column => (
                <DataTableCell
                    key={column.id}
                    align={Index.typesWithRightPlacement.includes(column.type) ? 'right' : 'left'}
                    onClick={() => this.props.onRowClick(row)}
                >
                    {row[column.id]}
                </DataTableCell>
            ));
            return (
                <DataTableRow key={row[rowIdKey]} dataTest={row[rowIdKey]}>
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
                    <DataTableBody loading={updating}>{this.renderBody(visibleColumns)}</DataTableBody>
                </DataTable>
            </div>
        );
    }
}

export const OnlineList = withStyles(getStyles)(Index);
