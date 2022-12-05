import type { apiProgramStage } from 'capture-core/metaDataStoreLoaders/programs/quickStoreOperations/types';
import { Program } from '../../../../../metaData';
export declare const useProgramStages: (program: Program, programStages?: Array<apiProgramStage>) => apiProgramStage[];
