// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

import classNames from 'classnames';

import i18n from '@dhis2/d2-i18n';
import elementTypes from '../../../../../metaData/DataElement/elementTypes';

import getTableComponents from '../../../../d2Ui/dataTable/getTableComponents';
import basicTableAdapter from '../../../../d2UiReactAdapters/dataTable/basicTable.adapter';
import paginationAdapter from '../../../../d2UiReactAdapters/dataTable/pagination.adapter';

import withData from '../Pagination/withData';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import withRowsPerPageSelector from '../../../../Pagination/withRowsPerPageSelector';
import SortLabelWrapper from '../../../../DataTable/SortLabelWrapper.component';
import { directions, placements } from '../../../../d2UiReactAdapters/dataTable/componentGetters/sortLabel.const';
import withFilterSelectors from '../FilterSelectors/withFilterSelectors';

import DownloadTable from '../../../../DownloadTable/DownloadTable.container';

import withHeader from '../Header/withHeader';
import withListHeaderWrapper from '../../ListHeaderWrapper/withListHeaderWrapper';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';

// $FlowSuppress
const { Table, Row, Cell, HeaderCell, Head, Body } = getTableComponents(basicTableAdapter);
// $FlowSuppress
const { Pagination } = getTableComponents(paginationAdapter);

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
    row: {},
    dataRow: {
        cursor: 'pointer',
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
                                ? directions.ASC
                                : directions.DESC
                        }
                        placement={
                            EventsList.typesWithRightPlacement.includes(column.type)
                                ? placements.RIGHT
                                : placements.LEFT
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
            </Row>
        );
    }

    renderRows(visibleColumns: Array<Column>) {
        const dataSource = this.props.dataSource;
        const classes = this.props.classes;

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
                    <div
                        className={classes.topBarRightContainer}
                    >
                        <IconButton>
                            <SettingsIcon
                                className={classes.optionsIcon}
                                onClick={() => { alert('not implemented yet'); }}
                            />
                        </IconButton>
                        <DownloadTable />
                    </div>
                </div>
                <div
                    className={classes.tableContainer}
                >
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
export default withHeader()(withListHeaderWrapper()(withFilterSelectors()(withStyles(styles)(EventsList))));
