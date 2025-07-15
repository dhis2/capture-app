import { ProgramStage } from '../../../metaData';

export type PlainProps = {
    eventStatus?: string,
    stage: ProgramStage,
    programId: string,
    orgUnit: any,
    setChangeLogIsOpen: (toggle: boolean) => void,
};
