// @flow
import type { Icon } from 'capture-core/metaData';
import { dataElementTypes } from '../../../metaData';

type StageOptions = {
    [code: string]: string;
}
export type StageDataElement = {
    id: string,
    name: string,
    type: $Keys<typeof dataElementTypes>,
    options?: StageOptions,
}

export type Stage = {
    id: string,
    name: string,
    description?: ?string,
    icon?: Icon,
    dataElements: Array<StageDataElement>,
    hideDueDate?: boolean,
    repeatable?: boolean
}

export type StageCommonProps = {|
    ready?: boolean,
    programId: string,
    onViewAll: (stageId: string) => void,
    onCreateNew: (stageId: string) => void,
    onEventClick: (eventId: string, stageId: string) => void
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
    orgUnitName: string,
    program: string,
    programStage: string,
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    trackedEntityInstance: string,
    notes?: Array<Object>,
    pendingApiResponse?: ?boolean,
|};
