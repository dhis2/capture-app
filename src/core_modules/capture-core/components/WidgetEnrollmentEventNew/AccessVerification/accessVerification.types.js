// @flow
import { type ProgramStage, type RenderFoundation, type TrackerProgram } from '../../../metaData';

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
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
    ...ContainerProps,
|};
