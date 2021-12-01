// @flow
import * as React from 'react';
import {
    Pagination,
} from 'capture-ui';
import i18n from '@dhis2/d2-i18n';
import { withRowsPerPageSelector } from '../../Pagination/withRowsPerPageSelector';
import { withNavigation } from '../../Pagination/withDefaultNavigation';
import type { Props } from './listPaginationMain.types';

const PaginationWrapped = withRowsPerPageSelector()(withNavigation()(Pagination));

export const ListPaginationMain = ({ rowCountPage, rowsPerPage, ...passOnProps }: Props) => (
    <PaginationWrapped
        {...passOnProps}
        rowsPerPage={rowsPerPage}
        rowsCountSelectorLabel={i18n.t('Rows per page')}
        nextPageButtonDisabled={!!(rowsPerPage > rowCountPage)}
    />
);
