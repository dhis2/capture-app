// @flow
import getPagination from './componentGetters/Pagination.componentGetter';

import type { Adapter } from '../d2Ui/types';

const reactAdapter: Adapter = {
    componentCreators: {
        Pagination: getPagination,
    },
};

export default reactAdapter;
