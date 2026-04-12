import React, { Component } from 'react';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import { searchOperatorHelpTexts, helpTextStyle } from '../../../constants';
import type { TextFilterProps, Value } from './text.types';
import { WithEmptyValueFilter } from '../EmptyValue';

export class TextFilter
    extends Component<TextFilterProps>
    implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;
        return getTextFilterData(value);
    }

    handleEnterKey = (value?: Value) => {
        this.props.onUpdate(value ?? this.props.value ?? null);
    }

    handleBlur = (value: string) => {
        this.props.onCommitValue(value, true);
    };

    handleChange = (value: string) => {
        this.props.onCommitValue(value);
    };

    render() {
        const { value, searchOperator } = this.props;
        const helpText = searchOperator && searchOperatorHelpTexts[searchOperator];

        return (
            <WithEmptyValueFilter
                value={value}
                onCommitValue={this.props.onCommitValue}
                disabled={this.props.disableEmptyValueFilter}
            >
                {filteredValue => (
                    <>
                        <Input
                            value={filteredValue}
                            onBlur={this.handleBlur}
                            onEnterKey={this.handleEnterKey}
                            onChange={this.handleChange}
                        />
                        {helpText && <div style={helpTextStyle}>{helpText}</div>}
                    </>
                )}
            </WithEmptyValueFilter>
        );
    }
}
