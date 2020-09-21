// @flow
import type { FiltersData } from '../types';

export type Props = $ReadOnly<{
    filters?: FiltersData,
    onChangePage: Function,
    onChangeRowsPerPage: Function,
    rowsPerPage: number,
    currentPage: number,
    rowsCount: number,
}>;
