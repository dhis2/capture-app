// @flow
import type { TeiColumnMetaForDataFetching } from '../../../../../types';

export type ApiTeiAttributes = Array<{
    attribute: string,
    value: any,
}>;

export type ApiTei = {
    trackedEntity: string,
    attributes?: ApiTeiAttributes,
    programOwners: Array<{
        orgUnit: string,
        program: string,
    }>,
};
export type ApiTeis = Array<ApiTei>;

export type ApiTeiResponse = {|
    trackedEntityInstances: ApiTeis,
|};

export type TeiColumnsMetaForDataFetchingArray = Array<TeiColumnMetaForDataFetching>;

export type RawFilterQueryArgs = {| [id: string]: string |};
export type RawQueryArgs = {|
    page: number,
    pageSize: number,
    programId: string,
    orgUnitId: string,
    filters?: RawFilterQueryArgs,
    sortById: string,
    sortByDirection: string,
|};

export type ApiQueryArgs = {|
    page: number,
    pageSize: number,
    program: string,
    ou: string,
|};

export type ClientTei = {|
    id: string,
    record: {
        [string]: any,
        programOwner?: string,
    },
|};

export type ClientTeis = Array<ClientTei>;
