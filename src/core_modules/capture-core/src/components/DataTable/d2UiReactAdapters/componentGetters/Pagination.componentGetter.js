// @flow
import * as React from 'react';

type Props = {
    rowsCount: number,
    rowsPerPage: number,
    currentPage: number,
    rowsCountSelector?: ?React.Node,
    rowsCountSelectorLabel?: ?string,
    navigationElements: React.Node,
    onGetLabelDisplayedRows?: ?(fromToLabel: string, totalLabel: string) => string,
};

class Pagination extends React.Component<Props> {
    static getFromToLabel(rowsCount: number, rowsPerPage: number, currentPage: number) {
        const fromCount = (rowsPerPage * (currentPage - 1)) + 1;

        if (fromCount > rowsCount) {
            return '-';
        }

        const toCount = Math.min(rowsPerPage * currentPage, rowsCount);
        return `${fromCount}-${toCount}`;
    }

    static getRowsCountElement(rowsCountSelectorLabel?: ?string, rowsCountSelector?: ?React.Node) {
        if (!rowsCountSelector) {
            return null;
        }

        return rowsCountSelectorLabel ? (
            <div
                className={'d2-pagination-rows-per-page-element-container'}
            >
                {rowsCountSelectorLabel}:
                <span
                    className={'d2-pagination-rows-per-page-element'}
                >
                    {rowsCountSelector}
                </span>
            </div>
        ) : rowsCountSelector;
    }

    static wrapDisplayedRowsElement(displayedRowsTable: React.Node) {
        return (
            <div
                className={'d2-rows-display-rows-container'}
            >
                {displayedRowsTable}
            </div>
        );
    }

    render() {
        const {
            rowsCount,
            rowsPerPage,
            currentPage,
            rowsCountSelector,
            rowsCountSelectorLabel,
            navigationElements,
            onGetLabelDisplayedRows } = this.props;

        const rowsCountElement = Pagination.getRowsCountElement(rowsCountSelectorLabel, rowsCountSelector);
        const displayedRowsTable = onGetLabelDisplayedRows &&
            Pagination.wrapDisplayedRowsElement(
                onGetLabelDisplayedRows(
                    Pagination.getFromToLabel(rowsCount, rowsPerPage, currentPage), rowsCount.toString()),
            );
        return (
            <div
                className={'d2-table-cell-pagination-default'}
            >
                {rowsCountElement}
                {displayedRowsTable}
                {navigationElements}
            </div>
        );
    }
}

const getPagination = () => Pagination;

export default getPagination;
