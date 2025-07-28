import { singleOrientations } from './singleSelectBoxes.const';

export type Props = {
    onBlur: (value: any) => void;
    options: Array<{text: string; value: any}>;
    label?: string;
    nullable?: boolean;
    value?: any;
    orientation?: keyof typeof singleOrientations | null;
    required?: boolean | null;
    classes: {
        label: string;
        iconSelected: string;
        iconDeselected: string;
        radio: string;
    };
    style?: any | null;
};
