// @flow
import { typeof dataElementTypes } from '../../../../../../metaData';

export type BuildFilterQueryArgsColumns = Map<string, {| type: $Values<dataElementTypes>, [string]: any |}>;
export type BuildFilterQueryArgsFiltersOnly = Map<string, {| type: $Values<dataElementTypes>, [string]: any |}>;

export type BuildFilterQueryArgsMeta = {|
    columns: BuildFilterQueryArgsColumns,
    filtersOnly?: BuildFilterQueryArgsFiltersOnly,
    storeId: string,
    isInit?: boolean,
|};
