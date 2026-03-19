import type { MainViewConfig } from './types';

export type Props = {
    storeId: string,
    orgUnitId: string,
    programId?: string,
    programStageId?: string,
    mainViewConfig?: MainViewConfig,
};
