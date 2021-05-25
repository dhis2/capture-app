// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
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
import { SortLabelWrapper } from '../../DataTable/SortLabelWrapper.component';
import { dataElementTypes } from '../../../metaData';
import type { OptionSet } from '../../../metaData';
import { LoadingMask } from '../../LoadingMasks';


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
    type: $Keys<typeof dataElementTypes>,
    optionSet?: ?OptionSet,
};

type Props = {
    dataSource: Array<Object>,
    rowIdKey: string,
    columns: ?Array<Column>,
    sortById: string,
    sortByDirection: string,
    onSort: (id: string, direction: string) => void,
    updating?: ?boolean,
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


class Index extends React.Component<Props> {
    columnHeaderInstances: Array<HTMLElement>;
    constructor(props: Props) {
        super(props);
        this.columnHeaderInstances = [];
    }
    static typesWithAscendingInitialDirection = [
        dataElementTypes.TEXT,
        dataElementTypes.LONG_TEXT,
        dataElementTypes.USERNAME,
        'ASSIGNEE',
    ];

    static typesWithRightPlacement = [
        dataElementTypes.NUMBER,
        dataElementTypes.INTEGER,
        dataElementTypes.INTEGER_POSITIVE,
        dataElementTypes.INTEGER_NEGATIVE,
        dataElementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];
    getSortHandler = (id: string) => (direction: string) => {
        this.props.onSort(id, direction);
    }

    setColumnWidth(columnInstance: any, index: number) {
        if (columnInstance && !this.props.updating) {
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
                    style={{ width: this.props.updating && this.columnHeaderInstances.length - 1 >= index ? this.columnHeaderInstances[index].clientWidth : 'auto' }}
                >
                    <SortLabelWrapper
                        isActive={column.id === sortById}
                        initialDirection={
                            Index.typesWithAscendingInitialDirection.includes(column.type)
                                ? sortLabelDirections.ASC
                                : sortLabelDirections.DESC
                        }
                        placement={
                            Index.typesWithRightPlacement.includes(column.type)
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
        const { classes, getCustomEndCellBody, updating } = this.props;
        const columnsCount = visibleColumns.length + (getCustomEndCellBody ? 1 : 0);

        return updating ?
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
                                            style={Index.typesWithRightPlacement.includes(column.type) ? { textAlign: 'right' } : null}
                                        >
                                            {row[column.id]}
                                        </div>
                                    </Cell>
                                ));
                            return (
                                <Row
                                    key={row[rowIdKey]}
                                    id={row[rowIdKey]}
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
                    data-test="online-list-table"
                >
                    <Head>
                        {this.renderHeaderRow(visibleColumns)}
                    </Head>
                    <Body
                        data-test="online-list-body"
                    >
                        {this.renderBody(visibleColumns)}
                    </Body>
                </Table>
            </div>
        );
    }
}

export const OnlineList = withStyles(getStyles)(Index);
