import type { FiltersData, ListViewPassOnProps, DataSource, ChangePage, ChangeRowsPerPage } from '../types';

type ComponentProps = {
    filters: FiltersData;
    onChangePage: ChangePage;
    onChangeRowsPerPage: ChangeRowsPerPage;
    rowsPerPage: number;
    currentPage: number;
    dataSource: DataSource;
};

type RestProps = Omit<ListViewPassOnProps, keyof ComponentProps>;

export type Props = RestProps & ComponentProps;

export type ListViewContextBuilderPassOnProps = RestProps & {
    dataSource: DataSource;
};
