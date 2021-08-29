// @flow
import { type ProgramStage, type RenderFoundation, type TrackerProgram } from '../../../metaData';
import type { ExternalSaveHandler } from '../common.types';

export type ContainerProps = {|
    program: TrackerProgram,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    onSaveExternal?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    onCancel?: () => void,
|};

export type Props = {|
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
    ...ContainerProps,
|};
