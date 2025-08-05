// @flow
import React, { Component } from 'react';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import {
    EmptyValueFilterCheckboxes,
    createEmptyValueCheckboxHandler,
    createNotEmptyValueCheckboxHandler,
    shouldShowMainInputForEmptyValueFilter,
} from '../../common/filters';
import type { UpdatableFilterContent } from '../types';

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

        if (!value) {
            return null;
        }

        return getTextFilterData(value);
    }

    handleEnterKey = (value: ?string) => {
        this.props.onUpdate(value || '');
    };

    handleBlur = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleInputChange = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleEmptyValueCheckboxChange = createEmptyValueCheckboxHandler(this.props.onCommitValue);

    handleNotEmptyValueCheckboxChange = createNotEmptyValueCheckboxHandler(this.props.onCommitValue);

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
                    value={shouldShowMainInputForEmptyValueFilter(value) ? value : ''}
                />
            </>
        );
    }
}
