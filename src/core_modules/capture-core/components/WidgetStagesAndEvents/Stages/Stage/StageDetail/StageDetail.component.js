// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors,
    spacersNum,
    TableBody,
    TableHead,
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
} from '@dhis2/ui';
import { generateDataTableFromEvent, getHeaderColumn } from '../helpers';
import type { Props } from './stageDetail.types';


const styles = {
    table: {
        display: 'block',
        overflowX: 'auto',
    },
    row: {
        maxWidth: '100%',
        whiteSpace: 'nowrap',
    },
    container: {
        display: 'flex',
        padding: spacersNum.dp8,
        backgroundColor: colors.grey200,
        alignItems: 'center',
    },
};

const StageDetailPlain = ({ events, data, classes }: Props) => {
    console.log({ events });
    function renderHeaderRow() {
        const headerCells = getHeaderColumn(data, events)
            .map(column => (
                <DataTableColumnHeader
                    key={column.id}
                >
                    {column.header}
                </DataTableColumnHeader>
            ));
        return (
            <DataTableRow
                className={classes.row}
            >
                {headerCells}
            </DataTableRow>
        );
    }

    function renderRows() {
        return generateDataTableFromEvent(data, events)
            .map((row, index) => {
                const cells = row
                    .map(column => (
                        <DataTableCell
                            key={column.id}
                        >
                            <div >
                                {column.value}
                            </div>
                        </DataTableCell>
                    ));

                return (
                    <DataTableRow
                        className={classes.row}
                        key={events[index].event}
                    >
                        {cells}
                    </DataTableRow>
                );
            });
    }

    return (
        <div className={classes.container}>
            <DataTable
                className={classes.table}
            >
                <TableHead>
                    {renderHeaderRow()}
                </TableHead>
                <TableBody>
                    {renderRows()}
                </TableBody>
            </DataTable>
        </div>
    );
};

export const StageDetail: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageDetailPlain);
