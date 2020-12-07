// @flow
import type { TeiColumnsMetaForDataFetchingArray, ClientTeis } from './types';

export type SubvalueKeysByType = {| [string]: Array<any> |};

export type SubvaluesByType = Array<{|type: string, subvalues: {|[key: string]: any|}|}>;

export type GetTeisWithSubvaluesPlainInner = (clientTeis: ClientTeis, columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray) => Promise<ClientTeis>;
