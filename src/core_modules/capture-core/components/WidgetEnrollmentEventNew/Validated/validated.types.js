// @flow
import type { ProgramStage, RenderFoundation, TrackerProgram } from '../../../metaData';
import { typeof addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import type {
    OrgUnit,
    ExternalSaveHandler,
    RulesExecutionDependencies,
    RulesExecutionDependenciesClientFormatted,
} from '../common.types';

export type ContainerProps = {|
    program: TrackerProgram,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    teiId: string,
    enrollmentId: string,
    orgUnit: OrgUnit,
    rulesExecutionDependencies: RulesExecutionDependencies,
    onSaveExternal?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    widgetReducerName: string,
    onCancel?: () => void,
|};

export type Props = {|
    programName: string,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    ready: boolean,
    id: string,
    itemId: string,
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    onCancel: () => void,
    formRef: (formInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
    ...CssClasses,
|};
