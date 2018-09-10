// @flow
import * as React from 'react';
import CheckedIcon from '../../../Icons/SingleSelectionCheckedIcon.component';
import UncheckedIcon from '../../../Icons/SingleSelectionUncheckedIcon.component';
import SingleSelectBox from './SingleSelectBox.component';
import orientations from '../../../constants/orientations.const';
import defaultClasses from '../../../../d2Ui/internal/selectionBoxes/singleSelectionBoxes.mod.css';
import type { OptionRendererInputData, OptionsArray, OptionRenderer } from '../selectBoxes.types';

type Props = {
    id: string,
    options: OptionsArray,
    onGetOptionData: (option: Object) => OptionRendererInputData,
    children?: ?OptionRenderer,
    value: any,
    orientation: $Values<typeof orientations>,
    classes?: ?{
        iconSelected?: string,
        iconDeselected?: string,
    },
    onSelect: (value: any) => void,
};

class SingleSelectionBoxes extends React.Component<Props> {
    getCheckedIcon() {
        return (
            <CheckedIcon
                className={this.props.classes && this.props.classes.iconSelected}
            />
        );
    }

    getUncheckedIcon() {
        return (
            <UncheckedIcon
                className={this.props.classes && this.props.classes.iconDeselected}
            />
        );
    }

    getIconElement(optionData: OptionRendererInputData, isSelected: boolean) {
        const { children } = this.props;
        const customIconElement = children ? children(optionData, isSelected) : null;
        if (customIconElement) {
            return customIconElement;
        }

        return isSelected ? this.getCheckedIcon() : this.getUncheckedIcon();
    }

    getOption(optionData: OptionRendererInputData, isSelected: boolean, index: number) {
        const { orientation, id: groupId, value, onSelect } = this.props;
        const containerClass = orientation === orientations.HORIZONTAL ?
            defaultClasses.optionContainerHorizontal : defaultClasses.optionContainerVertical;
        const tabIndex = isSelected || (index === 0 && !value && value !== false && value !== 0) ? 0 : -1;
        const IconElement = this.getIconElement(optionData, isSelected);

        return (
            <div
                className={containerClass}
            >
                <SingleSelectBox
                    optionData={optionData}
                    isSelected={isSelected}
                    tabIndex={tabIndex}
                    groupId={groupId}
                    onSelect={onSelect}
                >
                    {IconElement}
                </SingleSelectBox>
            </div>
        );
    }

    getSelectionOptions() {
        const { options, onGetOptionData, value } = this.props;
        return options
            .map((option, index) => {
                const optionData = onGetOptionData ? onGetOptionData(option) : option;
                const isSelected = optionData.value === value;
                const OptionElement = this.getOption(optionData, isSelected, index);
                return OptionElement;
            });
    }
    render() {
        const { orientation } = this.props;
        const containerClass = orientation === orientations.HORIZONTAL ?
            defaultClasses.containerHorizontal : defaultClasses.containerVertical;

        return (
            <div
                className={containerClass}
            >
                {this.getSelectionOptions()}
            </div>
        );
    }
}

export default SingleSelectionBoxes;
