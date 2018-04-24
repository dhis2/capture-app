// @flow
import getHeaderCell from './componentGetters/HeaderCell.componentGetter';
import getCell from './componentGetters/Cell.componentGetter';
import getRow from './componentGetters/Row.componentGetter';
import getTable from './componentGetters/Table.componentGetter';
import getHead from './componentGetters/Head.componentGetter';
import getBody from './componentGetters/Body.componentGetter';
import getFooter from './componentGetters/Footer.componentGetter';

import type { Adapter } from '../d2Ui/types';

const reactAdapter: Adapter = {
    componentCreators: {
        HeaderCell: getHeaderCell,
        Cell: getCell,
        Row: getRow,
        Table: getTable,
        Body: getBody,
        Head: getHead,
        Footer: getFooter,
    },
};

export default reactAdapter;
