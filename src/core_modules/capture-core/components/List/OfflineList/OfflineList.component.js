// @flow
import React, { Component } from 'react';
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
    sortLabelDirections,
    sorLabelPlacements,
} from 'capture-ui';
import SortLabelWrapper from '../../DataTable/SortLabelWrapper.component';
import elementTypes from '../../../metaData/DataElement/elementTypes';

const styles = theme => ({
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
});

type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Values<typeof elementTypes>,
};

type Props = {
    dataSource: Array<{id: string, [elementId: string]: any}>,
    columns: ?Array<Column>,
    classes: {
        loaderContainer: string,
        container: string,
        topBarContainer: string,
        tableContainer: string,
        optionsIcon: string,
        table: string,
        cell: string,
        headerCell: string,
        bodyCell: string,
        footerCell: string,
        row: string,
        dataRow: string,
    },
    rowIdKey: string,
    sortById: string,
    sortByDirection: string,
    onRowClick: (rowData: {id: string}) => void,
    noItemsText: ?string,
};

class Index extends Component<Props> {
    static defaultProps = {
        rowIdKey: 'id',
    };
    static typesWithAscendingInitialDirection = [
        // todo (report lgmt)
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.TEXT,
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.LONG_TEXT,
    ];

    static typesWithRightPlacement = [
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.NUMBER,
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.INTEGER,
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.INTEGER_POSITIVE,
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.INTEGER_NEGATIVE,
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.INTEGER_ZERO_OR_POSITIVE,
    ];

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
                        disabled
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
                        {this.props.noItemsText || i18n.t('No items to display')}
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
                                style={
                                    Index.typesWithRightPlacement.includes(column.type) ?
                                        { textAlign: 'right' } :
                                        null
                                }
                            >
                                {row[column.id]}
                            </div>
                        </Cell>
                    ));

                return (
                    <Row
                        key={row[this.props.rowIdKey]}
                        className={classNames(classes.row, classes.dataRow)}
                        onClick={() => this.props.onRowClick(row)}
                    >
                        {cells}
                    </Row>
                );
            });
    }

    render() {
        const { dataSource, columns, classes } = this.props; //eslint-disable-line

        const visibleColumns = columns ?
            columns
                .filter(column => column.visible) : [];

        return (
            <div
                className={classes.container}
            >
                <div
                    className={classes.topBarContainer}
                />
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
            </div>
        );
    }
}

/**
 * Create the offline list
 * @namespace OfflineList
 */
export const OfflineList = withStyles(styles)(Index);
