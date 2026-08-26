import { dataElementTypes } from '../../../../../metaData';

export type MetadataBasedColumn = {
    readonly id: string;
    readonly displayName: string;
    readonly type: keyof typeof dataElementTypes;
    readonly options?: Array<{ code: string; name: string }>;
};

export type ManualColumn = {
    readonly id: string;
    readonly displayName: string;
    readonly convertValue: (value: any) => any;
    readonly options?: Array<{ code: string; name: string }>;
};

export type TableColumn = MetadataBasedColumn | ManualColumn;

export type NavigationContextTrackedEntity = {
    readonly programId?: string;
};

export type NavigationContextEvent = {
    readonly [key: string]: never;
};

export type LinkedEntityData = {
    readonly id: string;
    readonly values: { readonly [id: string]: string | null | undefined };
    readonly baseValues?: {
        relationshipCreatedAt?: string;
        relationshipId: string;
        pendingApiResponse?: boolean;
    };
    readonly navigation?: {
        programId?: string;
        eventId?: string;
        trackedEntityId?: string;
    };
};

export type Context = {
    readonly navigation: NavigationContextTrackedEntity | NavigationContextEvent;
    readonly display: Record<string, unknown>;
};

export type LinkedEntityGroup = {
    readonly id: string;
    readonly name: string;
    readonly linkedEntities: readonly LinkedEntityData[];
    readonly columns: readonly TableColumn[];
    readonly context: Context;
};

export type GroupedLinkedEntities = readonly LinkedEntityGroup[];
