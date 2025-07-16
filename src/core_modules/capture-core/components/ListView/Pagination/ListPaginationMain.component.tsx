import * as React from 'react';
import {
    Pagination,
} from 'capture-ui';
import { withNavigation } from '../../Pagination/withDefaultNavigation';
import { withRowsPerPageSelector } from '../../Pagination/withRowsPerPageSelector';
import type { Props } from './listPaginationMain.types';

const PaginationWrapped = withRowsPerPageSelector()(withNavigation()(Pagination));

export const ListPaginationMain = ({ rowCountPage, rowsPerPage, ...passOnProps }: Props) => (
    <PaginationWrapped
        {...passOnProps}
        rowsPerPage={rowsPerPage}
    />
);
