// @flow
import getSortLabel from './componentGetters/SortLabel.componentGetter';
import type { Adapter } from '../d2Ui/types';

const reactAdapter: Adapter = {
    componentCreators: {
        SortLabel: getSortLabel,
    },
};

export default reactAdapter;
