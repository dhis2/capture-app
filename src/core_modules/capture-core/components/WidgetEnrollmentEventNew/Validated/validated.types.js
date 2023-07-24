// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { typeof addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import type {
    CommonValidatedProps,
    ExternalSaveHandler,
    RulesExecutionDependenciesClientFormatted,
} from '../common.types';


export type RequestEvent = {
    dataEntryItemId: string,
    dataEntryId: string,
    formFoundation: Object,
    programId: string,
    orgUnitId: string,
    orgUnitName: string,
    teiId: string,
    enrollmentId: string,
    completed?: boolean,
    onSaveExternal?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
}

export type ContainerProps = {|
    ...CommonValidatedProps,
    orgUnit: OrgUnit,
|};

export type Props = {|
    programName: string,
    programId: string,
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
