// @flow
import type { Options } from '../../FormFields/Options/SelectBoxes';

export type Props = {
    options: Options,
    value: any,
    onCommitValue: (value: any) => void,
    classes: {
        selectBoxesContainer: string,
        selectBoxesInnerContainer: string,
    },
    singleSelect?: ?boolean,
};
