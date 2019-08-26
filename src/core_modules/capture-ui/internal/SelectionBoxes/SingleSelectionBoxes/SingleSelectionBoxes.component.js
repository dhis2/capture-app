// @flow
import * as React from 'react';
import classNames from 'classnames';
import CheckedIcon from '../../../Icons/SingleSelectionCheckedIcon.component';
import UncheckedIcon from '../../../Icons/SingleSelectionUncheckedIcon.component';
import SingleSelectBox from './SingleSelectBox/SingleSelectBox.component';
import withFocusHandler from './SingleSelectBox/withFocusHandler';
import orientations from '../../../constants/orientations.const';
import defaultClasses from './singleSelectionBoxes.module.css';
import type { OptionRendererInputData, OptionsArray, OptionRenderer } from '../selectBoxes.types';

const SingleSelectBoxWrapped = withFocusHandler()(SingleSelectBox);

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
        iconDisabled?: string,
        focusSelected?: string,
        focusUnselected?: string,
        unFocus?: string,
    },
    onSelect: (value: any) => void,
    onSetFocus?: () => void,
    onRemoveFocus?: () => void,
    disabled?: ?boolean,
};

class SingleSelectionBoxes extends React.Component<Props> {
    static getFocusClass(classes: Object, isSelected: boolean) {
        return isSelected ? classes.focusSelected : classes.focusUnselected;
    }

    getCheckedClass = (iconSelected: ?string, iconDisabled?: string, isDisabled: ?boolean) => classNames(
        iconSelected,
        iconDisabled && { [iconDisabled]: isDisabled },
    );

    getUncheckedClass = (iconDeselected: ?string, iconDisabled?: string, isDisabled: ?boolean) => classNames(
        iconDeselected,
        iconDisabled && { [iconDisabled]: isDisabled },
    );

    getCheckedIcon() {
        const { classes, disabled } = this.props;
        const { iconDisabled, iconSelected } = classes || {};
        return (
            <CheckedIcon
                className={this.getCheckedClass(iconSelected, iconDisabled, disabled)}
            />
        );
    }

    getUncheckedIcon() {
        const { classes, disabled } = this.props;
        const { iconDisabled, iconDeselected } = classes || {};
        return (
            <UncheckedIcon
                className={this.getUncheckedClass(iconDeselected, iconDisabled, disabled)}
            />
        );
    }

    getPostProcessedCustomIcon(customElement: React.Element<any>, isSelected: boolean) {
        const { classes, disabled } = this.props;
        const { iconSelected, iconDeselected, iconDisabled } = classes || {};
        return React.cloneElement(customElement, isSelected ?
            { className: this.getCheckedClass(iconSelected, iconDisabled, disabled) } :
            { className: this.getUncheckedClass(iconDeselected, iconDisabled, disabled) }, null);
    }

    getIconElement(optionData: OptionRendererInputData, isSelected: boolean) {
        const { children } = this.props;
        const customIconElement = children ? children(optionData, isSelected) : null;
        if (customIconElement) {
            return this.getPostProcessedCustomIcon(customIconElement, isSelected);
        }

        return isSelected ? this.getCheckedIcon() : this.getUncheckedIcon();
    }

    getOption(optionData: OptionRendererInputData, isSelected: boolean, index: number) {
        const { orientation, id: groupId, value, onSelect, classes, onSetFocus, onRemoveFocus, disabled } = this.props;
        const containerClass = orientation === orientations.HORIZONTAL ?
            defaultClasses.optionContainerHorizontal : defaultClasses.optionContainerVertical;
        const tabIndex = isSelected || (index === 0 && !value && value !== false && value !== 0) ? 0 : -1;
        const IconElement = this.getIconElement(optionData, isSelected);

        return (
            <div
                className={containerClass}
                key={optionData.id || optionData.name}
            >
                { /* $FlowSuppress */ }
                <SingleSelectBoxWrapped
                    optionData={optionData}
                    isSelected={isSelected}
                    tabIndex={tabIndex}
                    groupId={groupId}
                    onSelect={onSelect}
                    focusClass={classes && SingleSelectionBoxes.getFocusClass(classes, isSelected)}
                    unFocusClass={classes && classes.unFocus}
                    onSetFocus={onSetFocus}
                    onRemoveFocus={onRemoveFocus}
                    disabled={disabled}
                >
                    {IconElement}
                </SingleSelectBoxWrapped>
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
