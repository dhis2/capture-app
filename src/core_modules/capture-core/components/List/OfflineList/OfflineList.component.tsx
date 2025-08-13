import React, { Component } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { DataTableHead, DataTable, DataTableBody, DataTableRow, DataTableCell, DataTableColumnHeader } from '@dhis2/ui';
import { dataElementTypes } from '../../../metaData';

const styles: Readonly<any> = {
    tableContainer: {
        overflow: 'auto',
    },
    headerAlign: {
        '&>span.container': {
            alignItems: 'flex-end',
        },
    },
};

type Column = {
    id: string;
    header: string;
    visible: boolean;
    type: keyof typeof dataElementTypes;
};

type Props = {
    dataSource: Array<{ id: string; [elementId: string]: any }>;
    columns: Array<Column> | null;
    rowIdKey: string;
    noItemsText: string | null;
} & WithStyles<typeof styles>;

class Index extends Component<Props> {
    static typesWithRightPlacement = [
        dataElementTypes.NUMBER,
        dataElementTypes.INTEGER,
        dataElementTypes.INTEGER_POSITIVE,
        dataElementTypes.INTEGER_NEGATIVE,
        dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];

    renderHeaderRow(visibleColumns: Column[]) {
        const { classes } = this.props;

        const headerCells = visibleColumns.map((column: any) => (
            <DataTableColumnHeader
                key={column.id}
                className={classNames({ [classes.headerAlign]: Index.typesWithRightPlacement.includes(column.type) })}
                align={Index.typesWithRightPlacement.includes(column.type) ? 'right' : 'left'}
            >
                {column.header}
            </DataTableColumnHeader>
        ));

        return <DataTableRow dataTest="table-row">{headerCells}</DataTableRow>;
    }

    renderRows(visibleColumns: Column[]) {
        const { dataSource, noItemsText, rowIdKey } = this.props;

        if (!dataSource || dataSource.length === 0) {
            const columnsCount = visibleColumns.length;
            return (
                <DataTableRow dataTest="table-row">
                    <DataTableCell colSpan={columnsCount.toString()}>{noItemsText || i18n.t('No items to display')}</DataTableCell>
                </DataTableRow>
            );
        }

        return dataSource.map((row) => {
            const cells = visibleColumns.map((column: any) => (
                <DataTableCell
                    key={column.id}
                    align={Index.typesWithRightPlacement.includes(column.type) ? 'right' : 'left'}
                >
                    {row[column.id]}
                </DataTableCell>
            ));

            return (
                <DataTableRow key={row[rowIdKey]} dataTest="table-row">
                    {cells}
                </DataTableRow>
            );
        });
    }

    render() {
        const { columns, classes } = this.props;
        const visibleColumns = columns ? columns.filter(column => column.visible) : [];

        return (
            <div className={classes.tableContainer}>
                <DataTable>
                    <DataTableHead>{this.renderHeaderRow(visibleColumns)}</DataTableHead>
                    <DataTableBody>{this.renderRows(visibleColumns)}</DataTableBody>
                </DataTable>
            </div>
        );
    }
}
export const OfflineList = withStyles(styles)(Index);
