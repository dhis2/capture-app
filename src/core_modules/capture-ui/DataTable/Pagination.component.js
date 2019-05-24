// @flow
import * as React from 'react';
import defaultClasses from './table.module.css';

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
                className={defaultClasses.paginationRowsPerPageElementContainer}
            >
                {rowsCountSelectorLabel}:
                <span
                    className={defaultClasses.paginationRowsPerPageElement}
                >
                    {rowsCountSelector}
                </span>
            </div>
        ) : rowsCountSelector;
    }

    static wrapDisplayedRowsElement(displayedRows: React.Node) {
        return (
            <div
                className={defaultClasses.paginationDisplayRowsContainer}
            >
                {displayedRows}
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
        const displayedRows = onGetLabelDisplayedRows &&
        Pagination.wrapDisplayedRowsElement(
            onGetLabelDisplayedRows(
                Pagination.getFromToLabel(rowsCount, rowsPerPage, currentPage), rowsCount.toString()),
        );
        return (
            <div
                className={defaultClasses.pagination}
            >
                {rowsCountElement}
                {displayedRows}
                {navigationElements}
            </div>
        );
    }
}

export default Pagination;
