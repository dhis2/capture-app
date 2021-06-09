// @flow
import React, { type ComponentType, useState } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { colors,
    spacersNum,
    DataTableBody,
    DataTableHead,
    DataTableFoot,
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    Button,
} from '@dhis2/ui';
import { computeDataFromEvent, computeHeaderColumn, DEFAULT_NUMBER_OF_ROW, sortDataFromEvent } from '../helpers';
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
    button: {
        marginRight: spacersNum.dp8,
    },
};

const StageDetailPlain = ({ events, eventName, data, classes }: Props) => {
    const headerColumns = computeHeaderColumn(data, events);
    const [{ columnName, sortDirection }, setSortInstructions] = useState({
        columnName: '',
        sortDirection: '',
    });
    const [displayedRowNumber, setDisplayedRowNumber] = useState(DEFAULT_NUMBER_OF_ROW);

    const getSortDirection = id => (id === columnName ? sortDirection : 'default');
    const onSortIconClick = ({ name, direction }) => {
        setSortInstructions({
            columnName: name,
            sortDirection: direction,
        });
    };

    function renderHeader() {
        const headerCells = headerColumns
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
            .slice(0, displayedRowNumber)
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

    const renderFooter = () => {
        const renderShowMoreButton = () => (events.length > DEFAULT_NUMBER_OF_ROW
            && displayedRowNumber < events.length ? <Button
                dataTest="show-more-button"
                className={classes.button}
                onClick={() => {
                    const nextRowIndex = Math.min(events.length, displayedRowNumber + DEFAULT_NUMBER_OF_ROW);
                    setDisplayedRowNumber(nextRowIndex);
                }}
            >{i18n.t('Show {{ rest }} more', { rest: events.length - displayedRowNumber })}</Button> : null);

        const renderViewAllButton = () => (events.length > 1 ? <Button
            dataTest="view-all-button"
            className={classes.button}
            onClick={() => {}}
        >{i18n.t('View all {{ all }}', { all: events.length })}</Button> : null);

        const renderCreateNewButton = () => (<Button
            className={classes.button}
            dataTest="create-new-button"
            onClick={() => {}}
        >{i18n.t('New {{ eventName }} event', { eventName })}</Button>);

        return (
            <DataTableRow>
                <DataTableCell colSpan={`${headerColumns.length}`}>
                    {renderShowMoreButton()}
                    {renderViewAllButton()}
                    {renderCreateNewButton()}
                </DataTableCell>
            </DataTableRow>
        );
    };

    return (
        <div className={classes.container}>
            <DataTable
                className={classes.table}
            >
                <DataTableHead>
                    {renderHeader()}
                </DataTableHead>
                <DataTableBody>
                    {renderRows()}
                </DataTableBody>
                <DataTableFoot>
                    {renderFooter()}
                </DataTableFoot>
            </DataTable>
        </div>
    );
};

export const StageDetail: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageDetailPlain);
