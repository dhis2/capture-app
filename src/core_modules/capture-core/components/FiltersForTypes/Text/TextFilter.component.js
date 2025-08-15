// @flow
import React, { Component } from 'react';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

type Value = ?string;

type Props = {
    onCommitValue: (value: ?string) => void,
    onUpdate: (updatedValue: ?string) => void,
    value: ?string,
};

// $FlowFixMe[incompatible-variance] automated comment
export class TextFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;

        return getTextFilterData(value);
    }

    handleEnterKey = (value: ?string) => {
        this.props.onUpdate(value || '');
    };

    handleBlur = (value: string) => {
        if (value) {
            this.props.onCommitValue(value);
        }
    };

    handleInputChange = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)(this.props.onCommitValue);
    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)(this.props.onCommitValue);

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
                    onChange={this.handleInputChange}
                    onBlur={this.handleBlur}
                    onEnterKey={this.handleEnterKey}
                    value={!isEmptyValueFilter(value) ? value : ''}
                />
            </>
        );
    }
}
