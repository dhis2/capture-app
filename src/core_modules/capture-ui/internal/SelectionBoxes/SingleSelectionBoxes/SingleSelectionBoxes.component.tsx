import * as React from 'react';
import classNames from 'classnames';
import { SingleSelectionCheckedIcon, SingleSelectionUncheckedIcon } from '../../../Icons';
import { SingleSelectBox } from './SingleSelectBox/SingleSelectBox.component';
import { withFocusHandler } from './SingleSelectBox/withFocusHandler';
import { orientations } from '../../../constants/orientations.const';
import defaultClasses from './singleSelectionBoxes.module.css';
import type { OptionRendererInputData, OptionsArray, OptionRenderer } from '../selectBoxes.types';
import type { KeyboardManager } from '../../../internal/SelectionBoxes/withKeyboardNavigation';

const SingleSelectBoxWrapped = withFocusHandler()(SingleSelectBox);

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
    keyboardManager: KeyboardManager;
    disabled?: boolean;
};

type State = {
    refList: Array<HTMLInputElement>;
};

export class SingleSelectionBoxes extends React.Component<Props, State> {
    static getFocusClass(classes: any, isSelected: boolean) {
        return isSelected ? classes.focusSelected : classes.focusUnselected;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            refList: [],
        };
    }

    onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!this.state.refList.includes(event.relatedTarget as HTMLInputElement)) {
            this.props.keyboardManager.clear();
            const foundRef = this.state.refList.find(ref => ref.checked);
            this.props.onSelect(foundRef ? foundRef.value : null);
        }
    }

    getCheckedClass = (iconSelected?: string, iconDisabled?: string, isDisabled?: boolean) => classNames(
        iconSelected,
        iconDisabled && { [iconDisabled]: isDisabled },
    );

    getUncheckedClass = (iconDeselected?: string, iconDisabled?: string, isDisabled?: boolean) => classNames(
        iconDeselected,
        iconDisabled && { [iconDisabled]: isDisabled },
    );

    getCheckedIcon() {
        const { classes, disabled } = this.props;
        const { iconDisabled, iconSelected } = classes || {};
        return (
            <SingleSelectionCheckedIcon
                className={this.getCheckedClass(iconSelected, iconDisabled, disabled)}
            />
        );
    }

    getUncheckedIcon() {
        const { classes, disabled } = this.props;
        const { iconDisabled, iconDeselected } = classes || {};
        return (
            <SingleSelectionUncheckedIcon
                className={this.getUncheckedClass(iconDeselected, iconDisabled, disabled)}
            />
        );
    }

    getPostProcessedCustomIcon(customElement: React.ReactElement<any>, isSelected: boolean) {
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
        const { orientation, id: groupId, value, onSelect, classes, onSetFocus, onRemoveFocus, keyboardManager, disabled } = this.props;
        const containerClass = orientation === orientations.HORIZONTAL ?
            defaultClasses.optionContainerHorizontal : defaultClasses.optionContainerVertical;
        const tabIndex = isSelected || (index === 0 && !value && value !== false && value !== 0) ? 0 : -1;
        const IconElement = this.getIconElement(optionData, isSelected);
        const setInputRef = (element: HTMLInputElement) => {
            this.setState((state) => {
                state.refList[index] = element;
            });
        };

        return (
            <div
                className={containerClass}
                key={optionData.id || optionData.name}
            >
                <SingleSelectBoxWrapped
                    setInputRef={setInputRef}
                    optionData={optionData}
                    isSelected={isSelected}
                    tabIndex={tabIndex}
                    groupId={groupId}
                    onSelect={onSelect}
                    onBlur={this.onBlur}
                    focusClass={classes && SingleSelectionBoxes.getFocusClass(classes, isSelected)}
                    unFocusClass={classes && classes.unFocus}
                    onSetFocus={onSetFocus}
                    onRemoveFocus={onRemoveFocus}
                    keyboardManager={keyboardManager}
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
    refList: Array<HTMLInputElement> = [];
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
