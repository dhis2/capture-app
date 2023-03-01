// @flow
import { type ProgramStage, type RenderFoundation, type TrackerProgram } from '../../../metaData';
import type { ExternalSaveHandler, RulesExecutionDependencies } from '../common.types';
import type { ProgramCategory } from '../../FormFields/New/CategoryOptions/CategoryOptions.types';

export type ContainerProps = {|
    program: TrackerProgram,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    programCategory?: ProgramCategory,
    rulesExecutionDependencies: RulesExecutionDependencies,
    onSaveExternal?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    widgetReducerName: string,
    onCancel?: () => void,
|};

export type Props = {|
    eventAccess: {|
        read: boolean,
        write: boolean,
    |},
    ...ContainerProps,
|};
