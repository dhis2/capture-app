// @flow
import type { ProgramStage, RenderFoundation, TrackerProgram } from '../../../metaData';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import type { OrgUnit } from '../common.types';

export type ContainerProps = {|
    program: TrackerProgram,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    onSaveActionType?: string,
    onSaveSuccessActionType?: string,
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
    onSave: (saveType: $Keys<typeof addEventSaveTypes>) => void,
    onCancel: () => void,
    formRef: (formInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
    ...CssClasses,
|};
