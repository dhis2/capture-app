import React, { Component } from 'react';
import { Checkbox } from '@dhis2/ui';
import { getEmptyOnlyFilterData } from './emptyOnlyFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import {
    makeCheckboxHandler,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EMPTY_VALUE_FILTER_LABEL,
    NOT_EMPTY_VALUE_FILTER_LABEL,
} from '../EmptyValue';

type Value = string | null | undefined;

type Props = {
    value?: Value;
    onCommitValue: (value?: Value | null) => void;
};

export class EmptyOnlyFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        return getEmptyOnlyFilterData(value);
    }

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)(this.props.onCommitValue);
    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)(this.props.onCommitValue);

    render() {
        const { value } = this.props;

        return (
            <div>
                <Checkbox
                    label={EMPTY_VALUE_FILTER_LABEL}
                    checked={value === EMPTY_VALUE_FILTER}
                    onChange={this.handleEmptyValueCheckboxChange}
                />
                <Checkbox
                    label={NOT_EMPTY_VALUE_FILTER_LABEL}
                    checked={value === NOT_EMPTY_VALUE_FILTER}
                    onChange={this.handleNotEmptyValueCheckboxChange}
                />
            </div>
        );
    }
}
