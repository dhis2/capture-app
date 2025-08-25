import type { ApiEnrollmentEvent } from '../../../../../../capture-core-utils/types/api-types';

export type DataValue = {
    dataElement: string;
    value: string;
};

export type Event = ApiEnrollmentEvent;

export type EnrollmentData = {
    createdAt?: string;
    createdAtClient?: string;
    deleted?: boolean;
    enrollment?: string;
    enrolledAt?: string;
    events?: Array<any>;
    occurredAt?: string;
    updatedAt?: string;
    updatedAtClient?: string;
    orgUnit?: string;
    program?: string;
    status?: string;
    storedBy?: string;
    scheduledAt?: string;
    trackedEntity?: string;
    trackedEntityType?: string;
    geometry?: { type: string; coordinates: [number, number] | Array<[number, number]> } | null;
} | Record<string, any>;

export type AttributeValue = {
    id: string;
    value: string;
};

export type Output = {
    error?: any;
    enrollment?: EnrollmentData;
    attributeValues?: Array<AttributeValue>;
};
