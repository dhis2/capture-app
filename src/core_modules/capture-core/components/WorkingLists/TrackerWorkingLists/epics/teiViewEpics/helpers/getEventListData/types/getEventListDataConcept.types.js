// @flow
import type { TeiColumnMetaForDataFetching } from '../../../../../types';

export type ApiTeiAttributes = Array<{
    attribute: string,
    value: any,
}>;

export type ApiDataElement = Array<{
    dataElement: string,
    value: any,
}>;

export type ApiTei = {
    trackedEntity: string,
    attributes?: ApiTeiAttributes,
    enrollments: Array<{ enrollment: string }>,
    programOwners: Array<{
        orgUnit: string,
        program: string,
    }>,
};
export type ApiEvent = {
    event: string,
    dataValues?: ApiDataElement,
    parent: ApiTei,
    trackedEntity: string,
    program: string,
    enrollment: string,
    scheduledAt: string,
};

export type ApiEvents = Array<ApiEvent>;
export type ApiTeis = Array<ApiTei>;

export type ApiEventsResponse = {|
    events: ApiEvents,
|};

export type TeiColumnsMetaForDataFetchingArray = Array<TeiColumnMetaForDataFetching>;

export type RawQueryArgs = {|
    page: number,
    pageSize: number,
    programId: string,
    programStageId?: string,
    orgUnitId: string,
    filters?: {| [id: string]: string |},
    sortById: string,
    sortByDirection: string,
|};

export type ApiQueryArgs = {|
    page: number,
    pageSize: number,
    program: string,
    ou: string,
|};

export type ClientEvent = {|
    id: string,
    record: {
        [string]: any,
    },
|};

export type ClientEvents = Array<ClientEvent>;
