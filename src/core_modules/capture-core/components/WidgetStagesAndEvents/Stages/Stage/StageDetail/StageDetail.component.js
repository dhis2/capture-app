// @flow
import React, { type ComponentType, useState, useCallback } from 'react';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
// $FlowFixMe
import {
    colors,
    spacers,
    spacersNum,
    theme,
    DataTableToolbar,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    Button,
    Tooltip,
} from '@dhis2/ui';
import log from 'loglevel';
import { sortDataFromEvent } from './hooks/sortFuntions';
import { StageCreateNewButton } from '../StageCreateNewButton';
import { useComputeDataFromEvent, useComputeHeaderColumn, formatRowForView } from './hooks/useEventList';
import { DEFAULT_NUMBER_OF_ROW, SORT_DIRECTION } from './hooks/constants';
import { getProgramAndStageForProgram } from '../../../../../metaData/helpers';
import type { Props } from './stageDetail.types';
import { EventRow } from './EventRow';
import { errorCreator } from '../../../../../../capture-core-utils';


const styles = {
    row: {
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    scrollBox: {
        overflowX: 'auto',
        overflow: 'hidden',
    },
    hidenButton: { display: 'none !important' },
    icon: {
        position: 'absolute',
        left: spacersNum.dp8,
        top: '1px',
    },
    label: {
        paddingLeft: spacersNum.dp32,
    },
    table: {
        border: 'none !important',
    },
    tableToolbar: {
        borderLeft: 'none !important',
        borderBottom: 'none !important',
        borderRight: 'none !important',
        borderTop: `1px solid ${colors.grey300} !important`,
        width: '100%',
        padding: '0 !important',
    },
    toolbarContent: {
        width: '100%',
    },
    showMoreButton: {
        width: '100%',
        border: 'none',
        background: colors.grey100,
        color: colors.grey800,
        fontSize: '13px',
        height: '24px',
        borderBottom: `1px solid ${colors.grey300}`,
        '&:hover': {
            background: colors.grey200,
            color: colors.grey900,
            cursor: 'pointer',
        },
        '&:focus': {
            outline: `3px solid ${theme.focus}`,
        },
    },
    newButton: {
        margin: `${spacers.dp8} ${spacers.dp12}`,
    },
};

const StageDetailPlain = (props: Props) => {
    const {
        events,
        eventName,
        stageId,
        programId,
        dataElements,
        hideDueDate = false,
        repeatable = false,
        enableUserAssignment = false,
        onEventClick,
        onDeleteEvent,
        onUpdateEventStatus,
        onRollbackDeleteEvent,
        onViewAll,
        onCreateNew,
        hiddenProgramStage,
        classes,
    } = props;
    const defaultSortState = {
        columnName: 'status',
        sortDirection: SORT_DIRECTION.DESC,
    };
    const { stage } = getProgramAndStageForProgram(programId, stageId);
    const headerColumns = useComputeHeaderColumn(dataElements, hideDueDate, enableUserAssignment, stage?.stageForm);
    const { loading, value: dataSource, error } = useComputeDataFromEvent(dataElements, events);


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

    const handleShowMore = useCallback(() => {
        const nextRowIndex = Math.min(events.length, displayedRowNumber + DEFAULT_NUMBER_OF_ROW);
        setDisplayedRowNumber(nextRowIndex);
    }, [events, displayedRowNumber, setDisplayedRowNumber]);

    function renderHeader() {
        const headerCells = headerColumns
            .map(column => (
                <DataTableColumnHeader
                    key={column.id}
                    name={column.id}
                    sortDirection={getSortDirection(column)}
                    onSortIconClick={column.sortDirection && onSortIconClick}
                >
                    {column.header}
                </DataTableColumnHeader>
            ));
        return (
            <DataTableRow
                className={classes.row}
            >
                {headerCells}

                <DataTableColumnHeader />
            </DataTableRow>
        );
    }

    function renderRows() {
        if (!dataSource || loading) {
            return null;
        }
        return dataSource
            .sort((dataA, dataB) => {
                const { type } = headerColumns.find(col => col.id === columnName) || {};
                // $FlowFixMe
                return sortDataFromEvent({ dataA, dataB, type, columnName, direction: sortDirection });
            })
            .slice(0, displayedRowNumber)
            .map(row => formatRowForView(row, dataElements))
            .map((row: Object) => {
                const cells = headerColumns.map(({ id }) => (
                    <Tooltip
                        key={`${id}-${row.id}`}
                        content={i18n.t('To open this event, please wait until saving is complete')}
                        closeDelay={50}
                    >
                        {({ onMouseOver, onMouseOut, ref }) => (
                            <DataTableCell
                                key={id}
                                onClick={() => !row.pendingApiResponse && onEventClick(row.id)}
                                ref={(tableCell) => {
                                    if (tableCell) {
                                        if (row.pendingApiResponse) {
                                            tableCell.onmouseover = onMouseOver;
                                            tableCell.onmouseout = onMouseOut;
                                            ref.current = tableCell;
                                        } else {
                                            tableCell.onmouseover = null;
                                            tableCell.onmouseout = null;
                                        }
                                    }
                                }}
                            >
                                <div>
                                    {row[id]}
                                </div>
                            </DataTableCell>
                        )}
                    </Tooltip>
                ));
                const eventDetails = events.find(event => event.event === row.id);

                if (!eventDetails) {
                    log.error(errorCreator('Event details not found')({ row }));
                    return null;
                }

                return (
                    <EventRow
                        id={row.id}
                        pendingApiResponse={row.pendingApiResponse}
                        eventDetails={eventDetails}
                        teiId={eventDetails.trackedEntity}
                        stageWriteAccess={stage?.access?.data?.write}
                        programId={programId}
                        enrollmentId={eventDetails.enrollment}
                        cells={cells}
                        onEventClick={onEventClick}
                        onDeleteEvent={onDeleteEvent}
                        onRollbackDeleteEvent={onRollbackDeleteEvent}
                        onUpdateEventStatus={onUpdateEventStatus}
                    />
                );
            });
    }

    function renderFooter() {
        const renderShowMoreButton = () => (dataSource && !loading
            && events.length > DEFAULT_NUMBER_OF_ROW
            && displayedRowNumber < events.length ? <button
                data-test="show-more-button"
                className={classes.showMoreButton}
                onClick={handleShowMore}
            >
                {i18n.t('Show {{ rest }} more', {
                    rest: Math.min(events.length - displayedRowNumber, DEFAULT_NUMBER_OF_ROW),
                })}
            </button>
            : null);

        const renderViewAllButton = () => (events.length > 1 ? <Button
            small
            secondary
            dataTest="view-all-button"
            className={classes.hidenButton} // DHIS2-11733: hide the button until the page is fully implemented
            onClick={handleViewAll}
        >{i18n.t('Go to full {{ eventName }}', { eventName, interpolation: { escapeValue: false } })}</Button> : null);

        const renderCreateNewButton = () => (
            <div className={classes.newButton}>
                <StageCreateNewButton
                    eventCount={events.length}
                    onCreateNew={handleCreateNew}
                    preventAddingEventActionInEffect={hiddenProgramStage}
                    repeatable={repeatable}
                    stageWriteAccess={stage?.access?.data?.write}
                    eventName={eventName}
                />
            </div>
        );

        return (
            <div className={classes.footerToolbar}>
                {renderShowMoreButton()}
                {renderViewAllButton()}
                {renderCreateNewButton()}
            </div>

        );
    }

    if (error) {
        return (
            <div>
                {i18n.t('Events could not be retrieved. Please try again later.')}
            </div>
        );
    }
    return (
        <div className={classes.container}>
            <div className={classes.scrollBox}>
                <DataTable
                    className={classes.table}
                >
                    <DataTableHead>
                        {renderHeader()}
                    </DataTableHead>
                    <DataTableBody>
                        {renderRows()}
                    </DataTableBody>
                </DataTable>
            </div>
            <DataTableToolbar className={classes.tableToolbar} position="bottom">
                <div className={classes.toolbarContent}>
                    {renderFooter()}
                </div>
            </DataTableToolbar>
        </div>
    );
};

export const StageDetail: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageDetailPlain);
