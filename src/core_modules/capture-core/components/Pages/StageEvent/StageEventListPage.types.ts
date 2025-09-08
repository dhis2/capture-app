import type { ProgramStage } from 'capture-core/metaData';

export type PlainProps = {
  programStage: ProgramStage | null | undefined;
  programId: string;
  orgUnitId: string;
};
