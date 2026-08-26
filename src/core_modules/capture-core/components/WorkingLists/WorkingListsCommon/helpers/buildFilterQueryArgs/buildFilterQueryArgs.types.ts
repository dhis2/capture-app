import { dataElementTypes } from '../../../../../metaData';

export type BuildFilterQueryArgsColumns = Map<string, {
    type: keyof typeof dataElementTypes;
    searchOperator?: string;
    [key: string]: any
}>;
export type BuildFilterQueryArgsFiltersOnly = Map<string, {
    type: keyof typeof dataElementTypes;
    searchOperator?: string;
    [key: string]: any
}>;

export type BuildFilterQueryArgsMeta = {
    columns: BuildFilterQueryArgsColumns;
    filtersOnly?: BuildFilterQueryArgsFiltersOnly;
    storeId: string;
    isInit?: boolean;
};
