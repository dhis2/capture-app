// @flow
import { dataElementTypes } from '../../../../../metaData';

export type MetadataBasedColumn = $ReadOnly<{|
    id: string,
    displayName: string,
    type: $Keys<typeof dataElementTypes>,
|}>;

export type ManualColumn = $ReadOnly<{|
    id: string,
    displayName: string,
    convertValue: (value: any) => any,
|}>;

export type TableColumn = MetadataBasedColumn | ManualColumn;

export type NavigationContextTrackedEntity = $ReadOnly<{|
    programId?: string,
|}>;

export type NavigationContextEvent = $ReadOnly<{||}>;

export type LinkedEntityData = $ReadOnly<{|
    id: string,
    values: $ReadOnly<{| [id: string]: ?string |}>,
    baseValues?: {
        relatonshipCreatedAt?: string,
        pendingApiResponse?: boolean,
    },
    navigation?: {
        programId?: string,
        eventId?: string,
        trackedEntityId?: string,
    },
|}>;

export type Context = $ReadOnly<{|
    navigation: NavigationContextTrackedEntity | NavigationContextEvent,
    display: Object,
|}>;

export type LinkedEntityGroup = $ReadOnly<{|
    id: string,
    name: string,
    linkedEntities: $ReadOnlyArray<LinkedEntityData>,
    columns: $ReadOnlyArray<TableColumn>,
    context: Context,
|}>;

export type GroupedLinkedEntities = $ReadOnlyArray<LinkedEntityGroup>;
