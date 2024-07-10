// @flow
import { typeof effectActions } from '@dhis2/rules-engine-javascript';
import type { Icon } from 'capture-core/metaData';
import { dataElementTypes, Option } from '../../../metaData';

type StageOptions = {
    [code: string]: string;
}
export type StageDataElement = {
    id: string,
    name: string,
    formName: string,
    type: $Keys<typeof dataElementTypes>,
    options?: StageOptions,
    optionSet?: { options: Array<Option> },
}

export type Stage = {
    id: string,
    name: string,
    description?: ?string,
    icon?: Icon,
    dataElements: Array<StageDataElement>,
    enableUserAssignment: boolean,
    hideDueDate?: boolean,
    repeatable?: boolean,
    dataAccess: { read: boolean, write: boolean },
}

export type StageCommonProps = {|
    ready?: boolean,
    programId: string,
    onViewAll: (stageId: string) => void,
    onCreateNew: (stageId: string) => void,
    onEventClick: (eventId: string) => void,
    ruleEffects?: Array<{id: string, type: $Values<effectActions>}>,
|}

export type DataValue = {
    dataElement: string,
    value: string,
}

export type Event = {|
    dataValues: Array<DataValue>,
    deleted?: boolean,
    scheduledAt: string,
    enrollment: string,
    enrollmentStatus: string,
    event: string,
    occurredAt: string,
    updatedAt: string,
    orgUnit: string,
    program: string,
    programStage: string,
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    trackedEntity: string,
    notes?: Array<Object>,
    pendingApiResponse?: ?boolean,
    assignedUser?: ApiAssignedUser,
    followUp?: boolean,
|};
