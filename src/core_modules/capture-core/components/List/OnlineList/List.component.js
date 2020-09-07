// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core';
import {
    Table,
    Head,
    Body,
    Row,
    Cell,
    HeaderCell,
    sortLabelDirections,
    sorLabelPlacements,
} from 'capture-ui';
import SortLabelWrapper from '../../DataTable/SortLabelWrapper.component';
import { dataElementTypes as elementTypes, OptionSet } from '../../../metaData';
import LoadingMask from '../../LoadingMasks/LoadingMask.component';


const getStyles = (theme: Theme) => ({
    tableContainer: {
        overflowX: 'auto',
    },
    table: {},
    row: {},
    loadingRow: {
        height: 100,
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
        // $FlowFixMe
        fontWeight: theme.typography.fontWeightMedium,
    },
    loadingCell: {
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
    dataSource: Array<Object>,
    rowIdKey: string,
    columns: ?Array<Column>,
    listId: string,
    sortById: string,
    sortByDirection: string,
    onSort: (listId: string, id: string, direction: string) => void,
    isUpdating?: ?boolean,
    isUpdatingWithDialog?: ?boolean,
    getCustomEndCellHeader: (props: Props) => React.Node,
    onRowClick: (rowData: Object) => void,
    getCustomEndCellBody: (row: Object, props: Props) => React.Node,
    customEndCellHeaderStyle?: ?Object,
    customEndCellBodyStyle?: ?Object,
    classes: {
        tableContainer: string,
        table: string,
        cell: string,
        headerCell: string,
        bodyCell: string,
        loadingCell: string,
        sortLabelChilden: string,
        loadingRow: string,
        row: string,
        dataRow: string,
    }
}


class List extends React.Component<Props> {
    static typesWithAscendingInitialDirection = [
        elementTypes.TEXT,
        elementTypes.LONG_TEXT,
        elementTypes.USERNAME,
        'ASSIGNEE',
    ];

    static typesWithRightPlacement = [
        elementTypes.NUMBER,
        elementTypes.INTEGER,
        elementTypes.INTEGER_POSITIVE,
        elementTypes.INTEGER_NEGATIVE,
        elementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];
    columnHeaderInstances: Array<HTMLElement>;
    constructor(props: Props) {
        super(props);
        this.columnHeaderInstances = [];
    }
    getSortHandler = (id: string) => (direction: string) => {
        this.props.onSort(this.props.listId, id, direction);
    }

    setColumnWidth(columnInstance: any, index: number) {
        if (columnInstance && !this.props.isUpdating) {
            this.columnHeaderInstances[index] = columnInstance;
        }
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

    getCustomEndCellBody = (row: Object, customEndCellBodyProps: Object) => {
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

    renderHeaderRow(visibleColumns: Array<Column>) {
        const sortById = this.props.sortById;
        const sortByDirection = this.props.sortByDirection;

        const headerCells = visibleColumns
            .map((column, index) => (
                <HeaderCell
                    innerRef={(instance) => { this.setColumnWidth(instance, index); }}
                    key={column.id}
                    className={classNames(this.props.classes.cell, this.props.classes.headerCell)}
                    style={{ width: this.props.isUpdating && this.columnHeaderInstances.length - 1 >= index ? this.columnHeaderInstances[index].clientWidth : 'auto' }}
                >
                    <SortLabelWrapper
                        isActive={column.id === sortById}
                        initialDirection={
                            List.typesWithAscendingInitialDirection.includes(column.type)
                                ? sortLabelDirections.ASC
                                : sortLabelDirections.DESC
                        }
                        placement={
                            List.typesWithRightPlacement.includes(column.type)
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

    renderBody(visibleColumns: Array<Column>) {
        const { classes, getCustomEndCellBody, isUpdating } = this.props;
        const columnsCount = visibleColumns.length + (getCustomEndCellBody ? 1 : 0);

        return isUpdating ?
            (
                <Row
                    className={classes.loadingRow}
                >
                    <Cell
                        colSpan={columnsCount}
                        className={classNames(classes.cell, classes.bodyCell, classes.loadingCell)}
                    >
                        <LoadingMask />
                    </Cell>
                </Row>
            ) : this.renderRows(visibleColumns, columnsCount);
    }

    renderRows(visibleColumns: Array<Column>, columnsCount: number) {
        const { dataSource, classes, rowIdKey, ...customEndCellBodyProps } = this.props;

        if (!dataSource || dataSource.length === 0) {
            return (
                <Row
                    className={classes.row}
                >
                    <Cell
                        colSpan={columnsCount}
                        className={classNames(classes.cell, classes.bodyCell)}
                    >
                        {i18n.t('No items to display')}
                    </Cell>
                </Row>
            );
        }

        return (
            <React.Fragment>
                {
                    dataSource
                        .map((row) => {
                            const cells = visibleColumns
                                .map(column => (
                                    <Cell
                                        key={column.id}
                                        className={classNames(classes.cell, classes.bodyCell)}
                                    >
                                        <div
                                            style={List.typesWithRightPlacement.includes(column.type) ? { textAlign: 'right' } : null}
                                        >
                                            {row[column.id]}
                                        </div>
                                    </Cell>
                                ));
                            return (
                                <Row
                                    key={row[rowIdKey]}
                                    className={classNames(classes.row, classes.dataRow)}
                                    onClick={() => this.props.onRowClick(row)}
                                >
                                    {cells}
                                    {this.getCustomEndCellBody(row, customEndCellBodyProps)}
                                </Row>
                            );
                        })
                }
            </React.Fragment>
        );
    }

    render() {
        const { classes, columns } = this.props;
        const visibleColumns = columns ? columns.filter(column => column.visible) : [];
        return (
            <div
                className={classes.tableContainer}
            >
                <Table
                    className={classes.table}
                    data-test="dhis2-capture-event-list-table"
                >
                    <Head>
                        {this.renderHeaderRow(visibleColumns)}
                    </Head>
                    <Body
                        data-test="dhis2-capture-event-list-body"
                    >
                        {this.renderBody(visibleColumns)}
                    </Body>
                </Table>
            </div>
        );
    }
}


export default withStyles(getStyles)(List);
