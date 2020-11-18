// @flow
/*
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Pagination } from 'capture-ui';
import withNavigation from '../../../../Pagination/withDefaultNavigation';
import withRowsPerPageSelector from '../../../../Pagination/withRowsPerPageSelector';
import type { Props } from './ListPagination.types';

const PaginationWrapped = withRowsPerPageSelector()(withNavigation()(Pagination));

export const ListPaginationComponent = ({
    onChangePage,
    onChangeRowsPerPage,
    listId,
    ...passOnProps
}: Props) => {
    const handleChangePage = (pageNumber: number) => {
        onChangePage(listId, pageNumber);
    };

    const handleChangeRowsPerPage = (rowsPerPage: number) => {
        onChangeRowsPerPage(listId, rowsPerPage);
    };

    return (
        <PaginationWrapped
            {...passOnProps}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsCountSelectorLabel={i18n.t('Rows per page')}
        />
    );
};
*/
