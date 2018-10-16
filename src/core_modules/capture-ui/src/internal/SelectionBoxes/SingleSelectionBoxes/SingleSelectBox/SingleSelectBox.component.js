// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './singleSelectBox.mod.css';
import type { OptionRendererInputData } from '../../selectBoxes.types';

type Props = {
    optionData: OptionRendererInputData,
    isSelected: boolean,
    groupId: string,
    children: React.Node,
    onSelect: (value: any) => void,
    inputRef?: (instance: ?HTMLInputElement) => void,
    inFocus?: ?boolean,
    focusClass?: string,
    unFocusClass?: string,
};

const keyboardKeys = {
    SPACE: ' ',
    ENTER: 'Enter',
};

class SingleSelectBox extends React.Component<Props> {
    isSpaceClickWhenSelected: ?boolean; // Pressing space when the radio is already selected, triggers both onKeyPress and onClick. This variable is used to prevent the onClick event in these circumstances.
    handleSelect = () => {
        if (this.isSpaceClickWhenSelected) {
            this.isSpaceClickWhenSelected = false;
            return;
        }

        const { onSelect, optionData, isSelected } = this.props;
        if (isSelected) {
            onSelect(null);
            return;
        }
        onSelect(optionData.value);
    }

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if ([keyboardKeys.SPACE, keyboardKeys.ENTER].includes(event.key)) {
            const { onSelect, optionData, isSelected } = this.props;
            if (isSelected) {
                this.isSpaceClickWhenSelected = event.key === keyboardKeys.SPACE;
                onSelect(null);
                return;
            }
            this.isSpaceClickWhenSelected = false;
            onSelect(optionData.value);
        }
    }

    render() {
        const {
            optionData,
            isSelected,
            groupId,
            children,
            inFocus,
            inputRef,
            focusClass,
            unFocusClass,
            onSelect,
            ...passOnProps
        } = this.props;
        const id = groupId + (optionData.id || optionData.name);

        return (
            <div>
                <label
                    htmlFor={id}
                    className={defaultClasses.label}
                >
                    <input
                        ref={inputRef}
                        type="radio"
                        className={defaultClasses.input}
                        name={groupId}
                        id={id}
                        checked={isSelected}
                        value={optionData.value}
                        onClick={this.handleSelect}
                        onKeyPress={this.handleKeyPress}
                        {...passOnProps}
                    />

                    <div
                        className={defaultClasses.iconFocusContainer}
                    >
                        <div
                            className={inFocus
                                ? classNames(defaultClasses.inFocus, focusClass)
                                : classNames(unFocusClass)
                            }
                        />
                        <div
                            className={defaultClasses.iconContainer}
                        >
                            {children}
                        </div>
                    </div>
                    <span
                        className={defaultClasses.name}
                    >
                        {optionData.name}
                    </span>
                </label>
            </div>
        );
    }
}

export default SingleSelectBox;
