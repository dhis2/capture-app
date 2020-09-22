// @flow
import * as React from 'react';
import defaultClasses from './table.module.css';

type Props = {
    rowsPerPage: number,
    currentPage: number,
    rowsCountSelector?: ?React.Node,
    rowsCountSelectorLabel?: ?string,
    navigationElements: React.Node,
};

class Pagination extends React.Component<Props> {
    static getFromToLabel(rowsPerPage: number, currentPage: number) {
        const fromCount = (rowsPerPage * (currentPage - 1)) + 1;

        const toCount = rowsPerPage * currentPage;
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


    static defaultProps = {
        onGetLabelDisplayedRows: (a: number, b: number) => `${a} of ${b}`,
    };

    render() {
        const {
            rowsPerPage,
            currentPage,
            rowsCountSelector,
            rowsCountSelectorLabel,
            navigationElements,
        } = this.props;

        const rowsCountElement = Pagination.getRowsCountElement(rowsCountSelectorLabel, rowsCountSelector);
        return (
            <div
                data-test="dhis2-capture-pagination"
                className={defaultClasses.pagination}
            >
                {rowsCountElement}
                {
                    rowsPerPage && currentPage &&
                    <div className={defaultClasses.paginationDisplayRowsContainer}>
                        {
                            Pagination.getFromToLabel(rowsPerPage, currentPage)
                        }
                    </div>
                }
                {navigationElements}
            </div>
        );
    }
}

export default Pagination;
