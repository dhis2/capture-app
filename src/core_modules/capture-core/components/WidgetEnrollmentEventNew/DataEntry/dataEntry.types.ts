import type { OrgUnit, ProgramStage, RenderFoundation } from '../../../metaData';
import type { RulesExecutionDependenciesClientFormatted } from '../common.types';

export type ContainerProps = {
    stage: ProgramStage;
    formFoundation: RenderFoundation;
    orgUnit?: OrgUnit;
    id: string;
    itemId: string;
    formRef: (formInstance: any) => void;
    dataEntryFieldRef: (instance: any, id: string) => void;
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted;
    onSaveAndCompleteEnrollment: (enrollment: Record<string, unknown>) => void;
    placementDomNodeForSavingText?: HTMLElement;
    programName: string;
};

export type Props = Omit<ContainerProps, 'orgUnit'>;
