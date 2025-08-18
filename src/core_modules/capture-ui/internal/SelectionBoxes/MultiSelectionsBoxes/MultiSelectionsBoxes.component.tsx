import React from 'react';
import type { OptionsArray, OptionRendererInputData, OptionRenderer, KeyboardManager } from '../selectBoxes.types';
import { orientations } from '../../../constants/orientations.const';

type Props = {
    id: string;
    options: OptionsArray;
    onGetOptionData: (option: any) => OptionRendererInputData;
    children?: OptionRenderer;
    value: any;
    orientation: typeof orientations[keyof typeof orientations];
    classes?: {
        iconSelected?: string;
        iconDeselected?: string;
        iconDisabled?: string;
        focusSelected?: string;
        focusUnselected?: string;
        unFocus?: string;
    };
    onSelect: (value: any) => void;
    onSetFocus?: () => void;
    onRemoveFocus?: () => void;
    keyboardManager?: KeyboardManager;
    disabled?: boolean;
};

export class MultiSelectionsBoxes extends React.Component<Props> {
    render() {
        return (
            <div>
                Multi
            </div>
        );
    }
}
