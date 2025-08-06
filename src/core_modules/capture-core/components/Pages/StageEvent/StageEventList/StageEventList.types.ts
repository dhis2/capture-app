import type { ProgramStage } from 'capture-core/metaData';

export type PlainProps = {
  stage: ProgramStage | null | undefined;
  programId: string;
  orgUnitId: string;
  onOpenBulkDataEntryPlugin?: (trackedEntityIds: string[]) => void;
};
