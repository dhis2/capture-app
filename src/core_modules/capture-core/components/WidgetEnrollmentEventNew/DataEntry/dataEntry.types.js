// @flow
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import type { RulesExecutionDependenciesClientFormatted } from '../common.types';

export type ContainerProps = {|
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    id: string,
    itemId: string,
    formRef: (formInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
|};

export type Props = $Diff<ContainerProps, {| orgUnit: OrgUnit |}>;
