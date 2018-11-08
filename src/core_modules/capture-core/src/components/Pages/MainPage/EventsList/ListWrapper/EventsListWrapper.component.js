// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';

import classNames from 'classnames';

import i18n from '@dhis2/d2-i18n';
import {
    Table,
    Row,
    Cell,
    HeaderCell,
    Head,
    Body,
    Pagination,
    sortLabelDirections,
    sorLabelPlacements,
} from 'capture-ui';
import SortLabelWrapper from '../../../../DataTable/SortLabelWrapper.component';
import elementTypes from '../../../../../metaData/DataElement/elementTypes';

import withData from '../Pagination/withData';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import withRowsPerPageSelector from '../../../../Pagination/withRowsPerPageSelector';
import withFilterSelectors from '../FilterSelectors/withFilterSelectors';

import ColumnSelector from '../../../../ColumnSelector/ColumnSelector.container';
import DownloadTable from '../../../../DownloadTable/DownloadTable.container';

import withHeader from '../Header/withHeader';
import withListHeaderWrapper from '../../ListHeaderWrapper/withListHeaderWrapper';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';
import withCustomEndCell from '../withCustomEndCell';
import eventContentMenuSettings from '../EventContentMenu/eventContentMenuSettings';
import LoadingMask from '../../../../LoadingMasks/LoadingMask.component';
import DialogLoadingMask from '../../../../LoadingMasks/DialogLoadingMask.component';

const PaginationNavigationHOC = withNavigation()(Pagination);
const RowsSelectorHOC = withRowsPerPageSelector()(PaginationNavigationHOC);
const EventListPagination = withData()(RowsSelectorHOC);

const styles = (theme: Theme) => ({
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    container: {
        borderColor: theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.8),
        borderWidth: '1px',
        borderStyle: 'solid',
    },
    topBarContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.typography.pxToRem(8),
    },
    topBarLeftContainer: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    topBarRightContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    tableContainer: {
        overflow: 'auto',
    },
    optionsIcon: {
        color: theme.palette.primary.main,
    },
    table: {},
    row: {
    },
    dataRow: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#F1FBFF',
        },
    },
    cell: {
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 7}px ${theme.spacing.unit /
            2}px ${theme.spacing.unit * 3}px`,
        '&:last-child': {
            paddingRight: theme.spacing.unit * 3,
        },
        borderBottomColor: theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.8),
    },
    bodyCell: {
        fontSize: theme.typography.pxToRem(13),
        color: theme.palette.text.primary,
    },
    staticHeaderCell: {
        width: 1,
    },
    headerCell: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
    },
    paginationContainer: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    sortLabelChilden: {
        '&:focus': {
            color: theme.palette.text.primary,
        },
        '&:hover': {
            color: theme.palette.text.primary,
        },
    },
    updatingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        textAlign: 'center',
    },
});

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof elementTypes>,
    optionSet?: ?OptionSet,
};

type Props = {
    dataSource: Array<{eventId: string, [elementId: string]: any}>,
    columns: ?Array<Column>,
    classes: {
        loaderContainer: string,
        container: string,
        topBarContainer: string,
        topBarLeftContainer: string,
        topBarRightContainer: string,
        tableContainer: string,
        paginationContainer: string,
        optionsIcon: string,
        table: string,
        cell: string,
        headerCell: string,
        bodyCell: string,
        footerCell: string,
        row: string,
        dataRow: string,
        sortLabelChilden: string,
    },
    sortById: string,
    sortByDirection: string,
    onSort: (id: string, direction: string) => void,
    onRowClick: (rowData: {eventId: string}) => void,
    filterButtons: React.Node,
    getCustomEndCellHeader: (props: Props) => React.Node,
    getCustomEndCellBody: (row: {eventId: string, [elementId: string]: any}, props: Props) => React.Node,
    customEndCellHeaderStyle?: ?Object,
    customEndCellBodyStyle?: ?Object,
    isUpdating?: ?boolean,
    isUpdatingWithDialog?: ?boolean,
};

class EventsList extends React.Component<Props> {
    static typesWithAscendingInitialDirection = [
        elementTypes.TEXT,
        elementTypes.LONG_TEXT,
    ];

    static typesWithRightPlacement = [
        elementTypes.NUMBER,
        elementTypes.INTEGER,
        elementTypes.INTEGER_POSITIVE,
        elementTypes.INTEGER_NEGATIVE,
        elementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];

    getSortHandler = (id: string) => (direction: string) => {
        this.props.onSort(id, direction);
    }

    renderHeaderRow(visibleColumns: Array<Column>) {
        const sortById = this.props.sortById;
        const sortByDirection = this.props.sortByDirection;

        const headerCells = visibleColumns
            .map(column => (
                <HeaderCell
                    key={column.id}
                    className={classNames(this.props.classes.cell, this.props.classes.headerCell)}
                >
                    <SortLabelWrapper
                        isActive={column.id === sortById}
                        initialDirection={
                            EventsList.typesWithAscendingInitialDirection.includes(column.type)
                                ? sortLabelDirections.ASC
                                : sortLabelDirections.DESC
                        }
                        placement={
                            EventsList.typesWithRightPlacement.includes(column.type)
                                ? sorLabelPlacements.RIGHT
                                : sorLabelPlacements.LEFT
                        }
                        direction={sortByDirection}
                        onSort={this.getSortHandler(column.id)}
                        childrenClass={this.props.classes.sortLabelChilden}
                    >
                        {column.header}
                    </SortLabelWrapper>
                </HeaderCell>
            ));

        return (
            <Row
                className={this.props.classes.row}
            >
                {headerCells}
                {this.getCustomEndCellHeader()}
            </Row>
        );
    }

    getCustomEndCellHeader = () => {
        const { getCustomEndCellHeader, getCustomEndCellBody, customEndCellHeaderStyle, classes } = this.props;

        return getCustomEndCellBody ?
            (
                <HeaderCell
                    className={classNames(classes.cell, classes.headerCell)}
                    style={customEndCellHeaderStyle}
                >
                    {getCustomEndCellHeader && getCustomEndCellHeader(this.props)}
                </HeaderCell>
            ) :
            null;
    }

    getCustomEndCellBody = (row: {eventId: string, [elementId: string]: any}, customEndCellBodyProps: Object) => {
        const { getCustomEndCellBody, customEndCellBodyStyle, classes } = this.props;

        return getCustomEndCellBody ?
            (
                <HeaderCell
                    className={classNames(classes.cell, classes.bodyCell)}
                    style={customEndCellBodyStyle}
                >
                    {getCustomEndCellBody(row, customEndCellBodyProps)}
                </HeaderCell>
            ) :
            null;
    }

    renderRows(visibleColumns: Array<Column>) {
        const dataSource = this.props.dataSource;
        const { classes, ...customEndCellBodyProps } = this.props;

        if (!dataSource || dataSource.length === 0) {
            const columnsCount = visibleColumns.length;
            return (
                <Row
                    className={classes.row}
                >
                    <Cell
                        colSpan={columnsCount}
                        className={classNames(classes.cell, classes.bodyCell)}
                    >
                        {i18n.t('No events to display')}
                    </Cell>
                </Row>
            );
        }

        return dataSource
            .map((row) => {
                const cells = visibleColumns
                    .map(column => (
                        <Cell
                            key={column.id}
                            className={classNames(classes.cell, classes.bodyCell)}
                        >
                            <div
                                style={EventsList.typesWithRightPlacement.includes(column.type) ? { textAlign: 'right' } : null}
                            >
                                {row[column.id]}
                            </div>
                        </Cell>
                    ));


                return (
                    <Row
                        key={row.eventId}
                        className={classNames(classes.row, classes.dataRow)}
                        onClick={() => this.props.onRowClick(row)}
                    >
                        {cells}
                        {this.getCustomEndCellBody(row, customEndCellBodyProps)}
                    </Row>
                );
            });
    }
    getPaginationLabelDisplayedRows =
        (fromToLabel: string, totalLabel: string) => `${fromToLabel} of ${totalLabel}`

    render() {
        const { dataSource, columns, classes, filterButtons } = this.props; //eslint-disable-line

        const visibleColumns = columns ?
            columns
                .filter(column => column.visible) : [];

        return (
            <div
                className={classes.container}
            >
                <div
                    className={classes.topBarContainer}
                >
                    <div
                        className={classes.topBarLeftContainer}
                    >
                        {filterButtons}
                    </div>
                    <div>
                        <ColumnSelector columns={columns} />
                        <DownloadTable />
                    </div>
                </div>
                <div
                    className={classes.tableContainer}
                >
                    {this.props.isUpdatingWithDialog && <DialogLoadingMask />}
                    {this.props.isUpdating && <LoadingMask /> }
                    {!this.props.isUpdating &&
                        <Table
                            className={classes.table}
                        >
                            <Head>
                                {this.renderHeaderRow(visibleColumns)}
                            </Head>
                            <Body>
                                {this.renderRows(visibleColumns)}
                            </Body>
                        </Table>
                    }
                </div>
                <div
                    className={classes.paginationContainer}
                >
                    <EventListPagination
                        rowsCountSelectorLabel={i18n.t('Rows per page')}
                        onGetLabelDisplayedRows={this.getPaginationLabelDisplayedRows}
                    />
                </div>
            </div>
        );
    }
}

/**
 * Create the event list for a event capture program
 * @namespace EventsList
 */
export default withHeader()(withListHeaderWrapper()(withCustomEndCell(eventContentMenuSettings)(withFilterSelectors()(withStyles(styles)(EventsList)))));
