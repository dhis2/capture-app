import { dataElementTypes } from '../../../../../metaData';

export type MetadataBasedColumn = Readonly<{
    id: string;
    displayName: string;
    type: keyof typeof dataElementTypes;
    options?: Array<{ code: string; name: string }>;
}>;

export type ManualColumn = Readonly<{
    id: string;
    displayName: string;
    convertValue: (value: any) => any;
    options?: Array<{ code: string; name: string }>;
}>;

export type TableColumn = MetadataBasedColumn | ManualColumn;

export type NavigationContextTrackedEntity = Readonly<{
    programId?: string;
}>;

export type NavigationContextEvent = Record<string, never>;

export type LinkedEntityData = Readonly<{
    id: string;
    values: Readonly<{ [id: string]: string | null | undefined }>;
    baseValues?: {
        relationshipCreatedAt?: string;
        relationshipId: string;
        pendingApiResponse?: boolean;
    };
    navigation?: {
        programId?: string;
        eventId?: string;
        trackedEntityId?: string;
    };
}>;

export type Context = Readonly<{
    navigation: NavigationContextTrackedEntity | NavigationContextEvent;
    display: Record<string, any>;
}>;

export type LinkedEntityGroup = Readonly<{
    id: string;
    name: string;
    linkedEntities: readonly LinkedEntityData[];
    columns: readonly TableColumn[];
    context: Context;
}>;

export type GroupedLinkedEntities = readonly LinkedEntityGroup[];
