import type { RenderFoundation } from '../../../metaData';

export type Props = {
    onSave: (saveType?: any) => void;
    formHorizontal?: boolean;
    formFoundation: RenderFoundation;
};
