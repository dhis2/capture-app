// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';
import { darken, fade, lighten } from 'material-ui-next/styles/colorManipulator';

import classNames from 'classnames';

import { getTranslation } from '../../../../d2/d2Instance';
import { formatterOptions } from '../../../../utils/string/format.const';
import elementTypes from '../../../../metaData/DataElement/elementTypes';

import getTableComponents from '../../../DataTable/d2Ui/getTableComponents';
import basicTableAdapter from '../../../DataTable/d2UiReactAdapters/basicTable.adapter';
import paginationAdapter from '../../../DataTable/d2UiReactAdapters/pagination.adapter';
import LoadingMask from '../../../LoadingMasks/LoadingMask.component';

import withData from './Pagination/withData';
import withNavigation from './Pagination/withDefaultNavigation';
import withRowsPerPageSelector from './Pagination/withRowsPerPageSelector';
import SortLabelWrapper from './SortLabelWrapper.component';
import { directions, placements } from '../../../DataTable/d2UiReactAdapters/componentGetters/sortLabel.const';

// $FlowSuppress
const { Table, Row, Cell, HeaderCell, Head, Body, Footer } = getTableComponents(basicTableAdapter);
// $FlowSuppress
const { Pagination } = getTableComponents(paginationAdapter);

const PaginationNavigationHOC = withNavigation()(Pagination);
const RowsSelectorHOC = withRowsPerPageSelector()(PaginationNavigationHOC);
const EventListPagination = withData()(RowsSelectorHOC);

const styles = theme => ({
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    table: {},
    row: {},
    cell: {
        padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit * 7}px ${theme.spacing.unit /
            2}px ${theme.spacing.unit * 3}px`,
        '&:last-child': {
            paddingRight: theme.spacing.unit * 3,
        },
        borderBottomColor: theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.8)
        ,
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
    footerCell: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightMedium,
    },
});

type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof elementTypes>,
};

type Props = {
    dataSource: Array<Object>,
    columns: ?Array<Column>,
    isLoading: boolean,
    classes: {
        loaderContainer: string,
        table: string,
        cell: string,
        headerCell: string,
        bodyCell: string,
        footerCell: string,
        row: string,
    },
    sortById: string,
    sortByDirection: string,
    onSort: (id: string, direction: string) => void,
};

class EventsList extends Component<Props> {
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

        if (!dataSource || dataSource.length === 0) {
            const columnsCount = visibleColumns.length;
            return (
                <Row
                    className={this.props.classes.row}
                >
                    <Cell
                        colSpan={columnsCount}
                        className={classNames(this.props.classes.cell, this.props.classes.bodyCell)}
                    >
                        {getTranslation('no_events_to_display', formatterOptions.CAPITALIZE_FIRST_LETTER)}
                    </Cell>
                </Row>
            );
        }

        return dataSource
            .map((row) => {
                const cells = visibleColumns
                    .map(header => (
                        <Cell
                            className={classNames(this.props.classes.cell, this.props.classes.bodyCell)}
                        >
                            {row[header.id]}
                        </Cell>
                    ));

                return (
                    <Row
                        className={this.props.classes.row}
                    >
                        {cells}
                    </Row>
                );
            });
    }

    getPaginationLabelDisplayedRows =
        (fromToLabel: string, totalLabel: string) => `${fromToLabel} of ${totalLabel}`

    render() {
        const { dataSource, columns, isLoading, classes } = this.props; //eslint-disable-line

        if (isLoading) {
            return (
                <div
                    className={classes.loaderContainer}
                >
                    <LoadingMask />
                </div>
            );
        }

        const visibleColumns = columns ?
            columns
                .filter(column => column.visible) : [];

        return (
            <div>
                <Table
                    className={classes.table}
                >
                    <Head>
                        {this.renderHeaderRow(visibleColumns)}
                    </Head>
                    <Body>
                        {this.renderRows(visibleColumns)}
                    </Body>
                    <Footer>
                        <Row>
                            <Cell
                                colSpan={3}
                                className={classNames(this.props.classes.cell, this.props.classes.footerCell)}
                            >
                                <EventListPagination
                                    rowsCountSelectorLabel={'Rows per page'}
                                    onGetLabelDisplayedRows={this.getPaginationLabelDisplayedRows}
                                />
                            </Cell>
                        </Row>
                    </Footer>
                </Table>
            </div>
        );
    }
}

export default withStyles(styles)(EventsList);
