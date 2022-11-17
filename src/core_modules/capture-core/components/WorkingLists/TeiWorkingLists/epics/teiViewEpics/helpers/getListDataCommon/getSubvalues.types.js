// @flow
import type { TeiColumnMetaForDataFetching } from '../../../../types';
import type { ClientEvents } from '../getEventListData/types';
import type { ClientTeis } from '../getTeiListData/types';

export type SubvalueKeysByType = {| [string]: Array<any> |};
export type ClientData = ClientTeis | ClientEvents;

export type SubvaluesByType = Array<{| type: string, subvalues: {| [key: string]: any |} |}>;

export type GetTeisWithSubvaluesPlainInner = (
    clientTeis: ClientEvents,
    columnsMetaForDataFetching: Array<TeiColumnMetaForDataFetching>,
) => Promise<ClientData>;
