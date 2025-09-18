import { dataElementTypes } from '../../../../../metaData';

export type BuildFilterQueryArgsColumns = Map<string, {
    type: keyof typeof dataElementTypes;
    unique?: boolean;
    [key: string]: any
}>;
export type BuildFilterQueryArgsFiltersOnly = Map<string, {
    type: keyof typeof dataElementTypes;
    unique?: boolean;
    [key: string]: any
}>;

export type BuildFilterQueryArgsMeta = {
    columns: BuildFilterQueryArgsColumns;
    filtersOnly?: BuildFilterQueryArgsFiltersOnly;
    storeId: string;
    isInit?: boolean;
};
