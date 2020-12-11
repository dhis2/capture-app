// @flow
import type { FiltersData, ListViewPassOnProps, DataSource } from '../types';

type ComponentProps = $ReadOnly<{|
  filters: FiltersData,
  onChangePage: Function,
  onChangeRowsPerPage: Function,
  rowsPerPage: number,
  currentPage: number,
  dataSource: DataSource,
|}>;

type RestProps = $Rest<ListViewPassOnProps, ComponentProps>;

export type Props = {|
  ...RestProps,
  ...ComponentProps,
|};

export type ListViewContextBuilderPassOnProps = {|
  ...RestProps,
  dataSource: DataSource,
|};
