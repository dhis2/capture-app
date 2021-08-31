// @flow
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import type { OrgUnit } from '../common.types';


export type ContainerProps = {|
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    id: string,
    itemId: string,
    formRef: (formInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
|};

export type Props = $Diff<ContainerProps, {| orgUnit: OrgUnit |}>;
