// @flow
import React, { type ComponentType, useState } from 'react';
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
import { computeDataFromEvent, computeHeaderColumn, sortDataFromEvent } from '../helpers';
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
    const [{ columnName, sortDirection }, setSortInstructions] = useState({
        columnName: '',
        sortDirection: '',
    });

    const getSortDirection = id => (id === columnName ? sortDirection : 'default');
    const onSortIconClick = ({ name, direction }) => {
        setSortInstructions({
            columnName: name,
            sortDirection: direction,
        });
    };
    function renderHeaderRow() {
        const headerCells = computeHeaderColumn(data, events)
            .map(column => (
                <DataTableColumnHeader
                    key={column.id}
                    name={column.id}
                    sortDirection={getSortDirection(column.id)}
                    onSortIconClick={onSortIconClick}
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
        return computeDataFromEvent(data, events)
            .sort((a, b) => {
                const strA = a.find(cl => cl.id === columnName)?.value;
                const strB = b.find(cl => cl.id === columnName)?.value;
                return sortDataFromEvent(strA, strB, sortDirection);
            })
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
