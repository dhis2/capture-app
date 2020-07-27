// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Pagination } from 'capture-ui';
import withData from '../Pagination/withData';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import withRowsPerPageSelector from '../../../../Pagination/withRowsPerPageSelector';

const PaginationWrapped = withRowsPerPageSelector()(withNavigation()(Pagination));

type Props = {
    listId: string,
    onChangePage: Function,
    onChangeRowsPerPage: Function,
};

class ListPagination extends React.Component<Props> {
    getPaginationLabelDisplayedRows =
        (fromToLabel: string, totalLabel: string) => `${fromToLabel} of ${totalLabel}`;

    handleChangePage = (pageNumber: number) => {
        this.props.onChangePage(this.props.listId, pageNumber);
    }

    handleChangeRowsPerPage = (rowsPerPage: number) => {
        this.props.onChangeRowsPerPage(this.props.listId, rowsPerPage);
    }

    render() {
        const { ...passOnProps } = this.props;
        return (
            // $FlowFixMe[prop-missing] automated comment
            <PaginationWrapped
                {...passOnProps}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                rowsCountSelectorLabel={i18n.t('Rows per page')}
                onGetLabelDisplayedRows={this.getPaginationLabelDisplayedRows}
            />
        );
    }
}

export default withData()(ListPagination);
