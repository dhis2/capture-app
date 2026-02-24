import React, { Component } from 'react';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { TextFilterProps, Value } from './Text.types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

export class TextFilter
    extends Component<TextFilterProps>
    implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;

        if (!value) {
            return null;
        }

        return getTextFilterData(value);
    }

    handleEnterKey = () => {
        this.props.onUpdate(this.props.value || null);
    }

    handleBlur = (value: string) => {
        this.props.onCommitValue(value, true);
    };

    handleChange = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value || null);
    });
    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value || null);
    });

    render() {
        const { value } = this.props;

        return (
            <>
                <EmptyValueFilterCheckboxes
                    value={value}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <Input
                    value={!isEmptyValueFilter(value) ? value : ''}
                    onBlur={this.handleBlur}
                    onEnterKey={this.handleEnterKey}
                    onChange={this.handleChange}
                />
            </>
        );
    }
}
