// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../../../d2Ui/internal/selectionBoxes/singleSelectBox.mod.css';
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

class SingleSelectBox extends React.Component<Props> {
    handleSelect = () => {
        const { onSelect, optionData, isSelected } = this.props;
        if (isSelected) {
            onSelect(null);
        }
        onSelect(optionData.value);
    }

    render() {
        const { optionData, isSelected, groupId, children, inFocus, inputRef, focusClass, unFocusClass, ...passOnProps } = this.props;
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
                        {...passOnProps}
                    />

                    <div
                        className={inFocus ? classNames(focusClass, defaultClasses.iconContainer) : classNames(defaultClasses.iconContainer, unFocusClass)}
                    >
                        {children}
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
