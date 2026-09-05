import type { RenderFoundation } from '../../../metaData';

export type Props = {
    onDelete: () => void;
    formHorizontal?: boolean;
    formFoundation: RenderFoundation;
    hasDeleteButton?: boolean;
};

export type State = {
    isOpen: boolean;
};
