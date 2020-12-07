// @flow
import { typeof dataElementTypes } from '../../../../../../metaData';

export type BuildFilterQueryArgsColumns = Map<string, {| type: $Values<dataElementTypes>, [string]: any |}>;

export type BuildFilterQueryArgsMeta = {|
    columns: BuildFilterQueryArgsColumns,
    storeId: string,
    isInit?: boolean,
|};
