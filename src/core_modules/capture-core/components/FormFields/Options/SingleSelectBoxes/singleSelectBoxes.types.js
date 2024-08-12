// @flow
import { typeof singleOrientations } from './singleSelectBoxes.const';

export type Props = {
    onBlur: (value: any) => void,
    options: Array<{text: string, value: any}>,
    label?: string,
    nullable?: boolean,
    value?: any,
    orientation?: ?$Values<singleOrientations>,
    required?: ?boolean,
    classes: {
        label: string,
        iconSelected: string,
        iconDeselected: string,
        radio: string,
    },
    style?: ?Object,
};
