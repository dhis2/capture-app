import type { ProgramStage, RenderFoundation } from '../../../../metaData';

export type Props = {
    programId: string;
    stageId?: string;
};

export type ReturnType = {
    formFoundation: RenderFoundation | null;
    stage: ProgramStage | null;
    isLoading: boolean;
    isError: boolean;
};
