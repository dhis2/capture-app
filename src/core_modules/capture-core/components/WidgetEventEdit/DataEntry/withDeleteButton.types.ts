import type { RenderFoundation } from '../../../metaData';

export type Props = {
    onDelete: () => void;
    formHorizontal?: boolean;
    formFoundation: RenderFoundation;
    hasDeleteButton?: boolean;
    programId: string;
};

export type State = {
    isOpen: boolean;
};
