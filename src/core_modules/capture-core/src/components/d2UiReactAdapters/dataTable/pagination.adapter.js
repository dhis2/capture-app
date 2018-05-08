// @flow
/**
 * @module d2-ui-react-adapters/dataTablePaginationAdapter
 */

import getPagination from './componentGetters/Pagination.componentGetter';

import type { Adapter } from '../../d2Ui/dataTable/types';

const reactAdapter: Adapter = {
    componentCreators: {
        Pagination: getPagination,
    },
};
/**
 * {Object} Pagination Table Adapter. Contains the Pagination component
 */

export default reactAdapter;
