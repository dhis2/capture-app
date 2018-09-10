// @flow
import * as React from 'react';
import defaultClasses from '../../../../d2Ui/internal/selectionBoxes/singleSelectBox.mod.css';
import type { OptionRendererInputData } from '../selectBoxes.types';

type Props = {
    optionData: OptionRendererInputData,
    isSelected: boolean,
    groupId: string,
    children: React.Node,
    onSelect: (value: any) => void,
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
        const { optionData, isSelected, groupId, children, ...passOnProps } = this.props;
        const id = groupId + (optionData.id || optionData.name);

        return (
            <div>
                <label
                    htmlFor={id}
                    className={defaultClasses.label}
                >
                    <input
                        type="radio"
                        className={defaultClasses.input}
                        name={groupId}
                        id={id}
                        checked={isSelected}
                        value={optionData.value}
                        onClick={this.handleSelect}
                        {...passOnProps}
                    />

                    {children}
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
