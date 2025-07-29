import React, { Component } from 'react';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { TextFilterProps, Value } from './Text.types';

export class TextFilter extends Component<TextFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;

        if (!value) {
            return null;
        }

        return getTextFilterData(value);
    }

    handleEnterKey = (value: Value) => {
        this.props.onUpdate(value || null);
    }

    handleBlur = (value: string) => {
        this.props.onCommitValue(value);
    }

    handleChange = (value: string) => {
        this.props.onCommitValue(value);
    }

    render() {
        const { value } = this.props;
        return (
            <Input
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onEnterKey={this.handleEnterKey}
                value={value}
            />
        );
    }
}
