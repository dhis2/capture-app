import React, { Component } from 'react';
import { getEmptyOnlyFilterData } from './emptyOnlyFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import {
    makeCheckboxHandler,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';
import type { EmptyOnlyFilterProps, Value } from './emptyOnly.types';

export class EmptyOnlyFilter extends Component<EmptyOnlyFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = updatedValue === undefined ? this.props.value : updatedValue;

        return getEmptyOnlyFilterData(value);
    }

    handleEmptyValueCheckboxChange = (event: { checked: boolean }) => {
        makeCheckboxHandler(EMPTY_VALUE_FILTER)(this.props.onCommitValue)(event);
    };
    handleNotEmptyValueCheckboxChange = (event: { checked: boolean }) => {
        makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)(this.props.onCommitValue)(event);
    };

    render() {
        const { value } = this.props;

        return (
            <EmptyValueFilterCheckboxes
                value={value}
                onEmptyChange={this.handleEmptyValueCheckboxChange}
                onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                showDivider={false}
            />
        );
    }
}
