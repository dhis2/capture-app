import { singleOrientations } from './singleSelectBoxes.const';

export type Props = {
    onBlur: (value: any) => void;
    options: Array<{text: string; value: any}>;
    label?: string;
    nullable?: boolean;
    value?: any;
    orientation?: typeof singleOrientations[keyof typeof singleOrientations] | null;
    required?: boolean | null;
    style?: any | null;
};
