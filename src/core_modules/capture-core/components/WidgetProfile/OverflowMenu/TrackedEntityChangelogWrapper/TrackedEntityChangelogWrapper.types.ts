import type { TrackerProgram } from '../../../../metaData';

type PassOnProps = {
    teiId: string;
    isOpen: boolean;
    setIsOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
    trackedEntityData: Record<string, any>;
};

export type Props = PassOnProps & {
    programAPI: TrackerProgram;
};
