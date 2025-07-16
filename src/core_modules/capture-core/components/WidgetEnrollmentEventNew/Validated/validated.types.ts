import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import type {
    CommonValidatedProps,
    RulesExecutionDependenciesClientFormatted,
} from '../common.types';

export type ContainerProps = {
    orgUnitContext?: any;
} & CommonValidatedProps;

export type Props = {
    programName: string;
    programId: string;
    enrollmentId: string;
    eventSaveInProgress: boolean;
    stage: ProgramStage;
    formFoundation: RenderFoundation;
    orgUnit?: any;
    ready: boolean;
    id: string;
    itemId: string;
    onSave: (saveType: keyof typeof addEventSaveTypes) => void;
    onCancel: () => void;
    onSaveAndCompleteEnrollment: (enrollment: any) => void;
    formRef: (formInstance: any) => void;
    relatedStageRef: (relatedStageInstance: any) => void;
    dataEntryFieldRef: (instance: any, id: string) => void;
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted;
};
