// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './singleSelectBox.module.css';
import type { OptionRendererInputData } from '../../selectBoxes.types';
import type { KeyboardManager } from '../../../../internal/SelectionBoxes/withKeyboardNavigation';

type Props = {
    optionData: OptionRendererInputData,
    isSelected: boolean,
    groupId: string,
    children: React.Node,
    onSelect: (value: any) => void,
    onBlur: (event: SyntheticFocusEvent<HTMLInputElement>, value: any) => void,
    inputRef?: (instance: ?HTMLInputElement) => void,
    inFocus?: ?boolean,
    focusClass?: string,
    unFocusClass?: string,
    keyboardManager: KeyboardManager,
    disabled?: ?boolean,
};

const keys = {
    TAB: 'Tab',
    SPACE: ' ',
    ENTER: 'Enter',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
};

// Pressing space triggers an automatic onClick event.
// We do not want this event to be processed, as we already do all required work in the keyboard event.
// This ignoreFlag variable makes it possible to determine if a given onClick event is of automatic origin.
let ignoreFlag = false;

export class SingleSelectBox extends React.Component<Props> {
    handleSelect = () => {
        const { onSelect, optionData, isSelected } = this.props;
        if (ignoreFlag) {
            ignoreFlag = false;
        } else {
            onSelect(isSelected ? null : optionData.value);
        }
    }

    handleKeyDown = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const { keyboardManager } = this.props;
        if (!keyboardManager.managedKeys.includes(event.key)) {
            return;
        }
        const handleKeyPress = keyboardManager.keyDown(event.key);
        if (!handleKeyPress) {
            event.preventDefault();
            return;
        }
        if (event.key === keys.TAB) {
            keyboardManager.clear();
            ignoreFlag = false;
        } else if ([keys.SPACE, keys.ENTER].includes(event.key)) {
            const { onSelect, optionData, isSelected } = this.props;
            onSelect(isSelected ? null : optionData.value);
            if (event.key === keys.SPACE) {
                ignoreFlag = true;
            }
        } else {
            ignoreFlag = true;
        }
    }

    handleKeyUp = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.props.keyboardManager.keyUp(event.key);
    }

    handleBlur = (event: SyntheticFocusEvent<HTMLInputElement>) => {
        const { isSelected, optionData } = this.props;
        this.props.onBlur(event, isSelected ? optionData.value : null);
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
            onBlur,
            disabled,
            ...passOnProps
        } = this.props;
        const id = groupId + (optionData.id || optionData.name);
        return (
            <div>
                <label
                    htmlFor={id}
                    className={classNames(defaultClasses.label, { [defaultClasses.labelDisabled]: disabled })}
                >
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <input
                        ref={inputRef}
                        type="radio"
                        className={defaultClasses.input}
                        name={groupId}
                        id={id}
                        checked={isSelected}
                        value={optionData.value}
                        onClick={this.handleSelect}
                        onBlur={this.handleBlur}
                        onKeyDown={this.handleKeyDown}
                        onKeyUp={this.handleKeyUp}
                        onChange={() => {}}
                        disabled={disabled}
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
