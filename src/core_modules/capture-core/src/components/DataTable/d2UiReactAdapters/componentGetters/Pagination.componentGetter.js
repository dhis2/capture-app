// @flow
import * as React from 'react';

type Props = {
    rowsCount: number,
    rowsPerPage: number,
    currentPage: number,
    rowsCountSelector: React.Node,
    navigationElements: React.Node,
};

class Pagination extends React.Component<Props> {
    render() {
        const { rowsCount, rowsPerPage, currentPage, rowsCountSelector, navigationElements } = this.props;
        return (
            <div
                className={'d2-table-cell-pagination-default'}
            >
                {navigationElements}
            </div>
        );
    }
}

const getPagination = () => Pagination;

export default getPagination;
