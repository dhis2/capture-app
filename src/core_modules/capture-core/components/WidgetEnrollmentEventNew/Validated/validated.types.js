// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { typeof addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import type {
    CommonValidatedProps,
    RulesExecutionDependenciesClientFormatted,
} from '../common.types';

export type ContainerProps = {|
    ...CommonValidatedProps,
    orgUnit: OrgUnit,
|};

export type Props = {|
    programName: string,
    programId: string,
    enrollmentId: string,
    eventSaveInProgress: boolean,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    ready: boolean,
    id: string,
    itemId: string,
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    onCancel: () => void,
    onSaveAndCompleteEnrollment: (enrollment: ApiEnrollment) => void,
    formRef: (formInstance: any) => void,
    relatedStageRef: (relatedStageInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
    ...CssClasses,
|};
