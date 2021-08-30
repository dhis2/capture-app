// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
// $FlowFixMe
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
    IconAdd24,
} from '@dhis2/ui';
import { sortDataFromEvent } from './hooks/sortFuntions';
import { useComputeDataFromEvent, useComputeHeaderColumn, formatRowForView } from './hooks/useEventList';
import { DEFAULT_NUMBER_OF_ROW, SORT_DIRECTION } from './hooks/constants';
import type { Props } from './stageDetail.types';


const styles = {
    row: {
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
    },
    container: {
        display: 'flex',
        marginRight: spacersNum.dp16,
        marginLeft: spacersNum.dp16,
        marginBottom: spacersNum.dp16,
        backgroundColor: colors.grey200,
        alignItems: 'center',
        overflowX: 'auto',
    },
    button: {
        marginRight: spacersNum.dp8,
    },
    icon: {
        position: 'absolute',
        left: spacersNum.dp8,
        top: '1px',
    },
    label: {
        paddingLeft: spacersNum.dp32,
    },
};

const StageDetailPlain = (props: Props) => {
    const {
        events,
        eventName,
        stageId,
        dataElements,
        hideDueDate = false,
        onEventClick,
        onViewAll,
        onCreateNew,
        classes } = props;
    const defaultSortState = {
        columnName: 'eventDate',
        sortDirection: SORT_DIRECTION.DESC,
    };
    const headerColumns = useComputeHeaderColumn(dataElements, hideDueDate);
    const { computeData, dataSource } = useComputeDataFromEvent(dataElements, events);

    React.useEffect(() => {
        if (!dataSource?.length) {
            computeData();
        }
    }, [dataSource, computeData]);

    const [{ columnName, sortDirection }, setSortInstructions] = useState(defaultSortState);
    const [displayedRowNumber, setDisplayedRowNumber] = useState(DEFAULT_NUMBER_OF_ROW);

    const getSortDirection = column => (column.id === columnName ? sortDirection : column.sortDirection);
    const onSortIconClick = ({ name, direction }) => {
        if (direction === SORT_DIRECTION.DEFAULT && name !== defaultSortState.columnName) {
            setSortInstructions(defaultSortState);
        } else {
            setSortInstructions({
                columnName: name,
                sortDirection: direction,
            });
        }
    };

    const handleViewAll = useCallback(() => {
        onViewAll(stageId);
    }, [onViewAll, stageId]);

    const handleCreateNew = useCallback(() => {
        onCreateNew(stageId);
    }, [onCreateNew, stageId]);

    function renderHeader() {
        const headerCells = headerColumns
            .map(column => (
                <DataTableColumnHeader
                    key={column.id}
                    name={column.id}
                    sortDirection={getSortDirection(column)}
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
        if (!dataSource) {
            return null;
        }
        return dataSource
            .sort((a, b) => {
                const { type } = headerColumns.find(col => col.id === columnName) || {};
                // $FlowFixMe
                return sortDataFromEvent(a[columnName], b[columnName], type, sortDirection);
            })
            .slice(0, displayedRowNumber)
            .map(row => formatRowForView(row, dataElements))
            .map((row: Object, index: number) => {
                const dataTableProgramStage = events[0].programStage;

                const cells = headerColumns.map(({ id }) => (<DataTableCell
                    key={id}
                    onClick={() => onEventClick(row.id, dataTableProgramStage)}
                >
                    <div>
                        { // $FlowFixMe
                            row[id]
                        }
                    </div>
                </DataTableCell>));


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

    function renderFooter() {
        const renderShowMoreButton = () => (events.length > DEFAULT_NUMBER_OF_ROW
            && displayedRowNumber < events.length ? <Button
                small
                secondary
                dataTest="show-more-button"
                className={classes.button}
                onClick={() => {
                    const nextRowIndex = Math.min(events.length, displayedRowNumber + DEFAULT_NUMBER_OF_ROW);
                    setDisplayedRowNumber(nextRowIndex);
                }}
            >
                {i18n.t('Show {{ rest }} more', {
                    rest: Math.min(events.length - displayedRowNumber, DEFAULT_NUMBER_OF_ROW),
                })}
            </Button>
            : null);

        const renderResetButton = () => (displayedRowNumber > DEFAULT_NUMBER_OF_ROW ? <Button
            small
            secondary
            dataTest="reset-button"
            className={classes.button}
            onClick={() => { setDisplayedRowNumber(DEFAULT_NUMBER_OF_ROW); }}
        >{i18n.t('Reset list')}</Button> : null);

        const renderViewAllButton = () => (events.length > 1 ? <Button
            small
            secondary
            dataTest="view-all-button"
            className={classes.button}
            onClick={handleViewAll}
        >{i18n.t('Go to full {{ eventName }}', { eventName })}</Button> : null);

        const renderCreateNewButton = () => (<Button
            small
            secondary
            className={classes.button}
            dataTest="create-new-button"
            onClick={handleCreateNew}
        >
            <div className={classes.icon}><IconAdd24 /></div>
            <div className={classes.label}>
                {i18n.t('New {{ eventName }} event', { eventName })}
            </div>
        </Button>);

        return (
            <DataTableRow>
                <DataTableCell colSpan={`${headerColumns.length}`}>
                    {renderShowMoreButton()}
                    {renderViewAllButton()}
                    {renderCreateNewButton()}
                    {renderResetButton()}
                </DataTableCell>
            </DataTableRow>
        );
    }

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
