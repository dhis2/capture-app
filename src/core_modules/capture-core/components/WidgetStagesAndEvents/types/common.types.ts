import { effectActions } from '@dhis2/rules-engine-javascript';
import type { Icon } from 'capture-core/metaData';
import type { ApiAssignedUser } from 'capture-core-utils/types/api-types';
import { dataElementTypes, Option } from '../../../metaData';

type StageOptions = {
    [code: string]: string;
}

export type StageDataElement = {
    id: string;
    name: string;
    formName: string;
    type: keyof typeof dataElementTypes;
    options?: StageOptions;
    optionSet?: { options: Array<Option> };
}

export type StageDataElementClient = {
    id: string;
    name: string;
    formName: string;
    type: keyof typeof dataElementTypes;
    options?: Array<{ value: any; text: any }>;
    optionSet?: { options: Array<any> };
};

export type Stage = {
    id: string;
    name: string;
    description?: string | null;
    icon?: Icon;
    dataElements: Array<StageDataElement>;
    enableUserAssignment: boolean;
    hideDueDate?: boolean;
    repeatable?: boolean;
    dataAccess: { read: boolean; write: boolean };
}

export type StageCommonProps = {
    ready?: boolean;
    programId: string;
    onViewAll: (stageId: string) => void;
    onCreateNew: (stageId: string) => void;
    onEventClick: (eventId: string) => void;
    ruleEffects?: Array<{id: string; type: typeof effectActions[keyof typeof effectActions]}>;
}

export type DataValue = {
    dataElement: string;
    value: string;
}

export type Event = {
    dataValues: Array<DataValue>;
    deleted?: boolean;
    scheduledAt: string;
    enrollment: string;
    enrollmentStatus: string;
    event: string;
    occurredAt: string;
    updatedAt: string;
    orgUnit: string;
    program: string;
    programStage: string;
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED';
    trackedEntity: string;
    notes?: Array<Record<string, unknown>>;
    pendingApiResponse?: boolean | null;
    assignedUser?: ApiAssignedUser;
    followUp?: boolean;
};
