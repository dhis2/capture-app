// @flow
import type { FiltersData, ListViewPassOnProps } from '../types';

type ComponentProps = $ReadOnly<{|
    filters: FiltersData,
    onChangePage: Function,
    onChangeRowsPerPage: Function,
    rowsPerPage: number,
    currentPage: number,
    rowsCount: number,
|}>;

type RestProps = $Rest<ListViewPassOnProps, ComponentProps>;

export type Props = {|
    ...RestProps,
    ...ComponentProps,
|};

export type ListViewContextBuilderPassOnProps = RestProps;
