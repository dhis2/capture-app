// @flow
import * as React from 'react';
import CheckedIcon from '../../../Icons/SingleSelectionCheckedIcon.component';
import UncheckedIcon from '../../../Icons/SingleSelectionUncheckedIcon.component';
import orientations from '../../../constants/orientations.const';
import defaultClasses from '../../../../d2Ui/internal/selectionBoxes/singleSelectionBoxes.mod.css';
import type { OptionRendererInputData, OptionsArray, OptionRenderer } from '../selectBoxes.types';

type Props = {
    options: OptionsArray,
    onGetOptionData: (option: Object) => OptionRendererInputData,
    children?: ?OptionRenderer,
    value: any,
    onSelect: (value: any) => void,
    orientation: $Values<typeof orientations>,
    classes?: ?{
        iconSelected?: string,
        iconDeselected?: string,
    },
};

class SingleSelectionBoxes extends React.Component<Props> {
    handleSelect(optionData: OptionRendererInputData, isSelected: boolean) {
        const onSelect = this.props.onSelect;
        if (isSelected) {
            onSelect(null);
        }
        onSelect(optionData.value);
    }

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

    getDefaultOption(optionData: OptionRendererInputData, isSelected: boolean) {
        const orientation = this.props.orientation;
        const IconElement = isSelected ? this.getCheckedIcon() : this.getUncheckedIcon();
        const containerClass = orientation === orientations.HORIZONTAL ?
            defaultClasses.optionContainerHorizontal : defaultClasses.optionContainerVertical;
        const tabIndex = isSelected ? 0 : -1;

        return (
            <div
                role="radio"
                name="aaa"
                aria-checked={isSelected}
                className={containerClass}
                onClick={() => this.handleSelect(optionData, isSelected)}
                tabIndex={0}
            >
                {IconElement}
                <span
                    className={defaultClasses.optionName}
                >
                    {optionData.name}
                </span>
            </div>
        );
    }

    getCustomOption(optionData: OptionRendererInputData, isSelected: boolean, children: OptionRenderer) {
        const IconElement = children(optionData, isSelected);
        if (!React.isValidElement(IconElement)) {
            return IconElement;
        }

        return React.cloneElement(IconElement, {
            onClick: () => this.handleSelect(optionData, isSelected),
        });
    }

    getSelectionOptions() {
        const { options, onGetOptionData, children, value } = this.props;
        return options
            .map((option) => {
                const optionData = onGetOptionData ? onGetOptionData(option) : option;
                const isSelected = optionData.value === value;
                const OptionElement = children ?
                    this.getCustomOption(optionData, isSelected, children) :
                    this.getDefaultOption(optionData, isSelected);
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
