// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';
import { darken, fade, lighten } from 'material-ui-next/styles/colorManipulator';

import classNames from 'classnames';

import { getTranslation } from '../../../../d2/d2Instance';
import { formatterOptions } from '../../../../utils/string/format.const';

import getTableComponents from '../../../DataTable/d2Ui/getTableComponents';
import reactAdapter from '../../../DataTable/d2UiReactAdapters/Table.adapter';
import LoadingMask from '../../../LoadingMasks/LoadingMask.component';

import withData from './Pagination/withData';
import withNavigation from './Pagination/withDefaultNavigation';
import withRowsPerPageSelector from './Pagination/withRowsPerPageSelector';

// $FlowSuppress
const { Table, Row, Cell, HeaderCell, Head, Body, Footer, Pagination } = getTableComponents(reactAdapter);

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
    }
});

type Props = {
    dataSource: Array<Object>,
    headers: Array<{
        id: string,
        text: string,
    }>,
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
};

class EventsList extends Component<Props> {
    renderHeaderRow() {
        const headers = this.props.headers;

        const headerCells = headers
            .map(header => (
                <HeaderCell
                    className={classNames(this.props.classes.cell, this.props.classes.headerCell)}
                >
                    {header.text}
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
    renderRows() {
        const dataSource = this.props.dataSource;
        const headers = this.props.headers;

        if (!dataSource || dataSource.length === 0) {
            const headersCount = headers.length;
            return (
                <Row
                    className={this.props.classes.row}
                >
                    <Cell
                        colSpan={headersCount}
                        className={classNames(this.props.classes.cell, this.props.classes.bodyCell)}
                    >
                        {getTranslation('no_events_to_display', formatterOptions.CAPITALIZE_FIRST_LETTER)}
                    </Cell>
                </Row>
            );
        }

        return dataSource
            .map((row) => {
                const cells = headers
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
        const { dataSource, headers, isLoading, classes } = this.props; //eslint-disable-line

        if (isLoading) {
            return (
                <div
                    className={classes.loaderContainer}
                >
                    <LoadingMask />
                </div>
            );
        }

        return (
            <div>
                <Table
                    className={classes.table}
                >
                    <Head>
                        {this.renderHeaderRow()}
                    </Head>
                    <Body>
                        {this.renderRows()}
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
