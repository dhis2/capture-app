// @flow
/**
 * @module d2-ui-react-adapters/dataTableSortLabelAdapter
 */
import getSortLabel from './componentGetters/SortLabel.componentGetter';
import type { Adapter } from '../../d2Ui/dataTable/types';

const reactAdapter: Adapter = {
    componentCreators: {
        SortLabel: getSortLabel,
    },
};

/**
 * {Object} SortLabel Table Adapter. Contains the SortLabel component
 */
export default reactAdapter;
