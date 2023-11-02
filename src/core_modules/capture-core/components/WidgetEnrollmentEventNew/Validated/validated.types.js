// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { typeof addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import type {
    CommonValidatedProps,
    RulesExecutionDependenciesClientFormatted,
} from '../common.types';


export type RequestEvent = {
    event: string,
    program: string,
    programStage: string,
    orgUnit: string,
    orgUnitName: string,
    trackedEntity: string,
    enrollment: string,
    scheduledAt: string,
    occurredAt: string,
    dataValues: Array<{ dataElement: string, value: any }>,
    notes: Array<{ value: string }>,
    status: ?string,
    completedAt: ?string,
}

export type ReferralRefPayload = {|
    getReferralValues: (eventId: string) => any,
    eventHasReferralRelationship: () => boolean,
    formIsValidOnSave: () => boolean,
|}

export type ContainerProps = {|
    ...CommonValidatedProps,
    orgUnit: OrgUnit,
|};

export type Props = {|
    programName: string,
    programId: string,
    eventSaveInProgress: boolean,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    ready: boolean,
    id: string,
    itemId: string,
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    onCancel: () => void,
    formRef: (formInstance: any) => void,
    referralRef: (referralInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
    ...CssClasses,
|};
