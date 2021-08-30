// @flow
import React, { Component } from 'react';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import type { UpdatableFilterContent } from '../types';

type Value = ?string;

type Props = {
    onCommitValue: (value: ?string) => void,
    onUpdate: (updatedValue: ?string) => void,
    value: ?string,
};

// $FlowSuppress
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
            /* $FlowSuppress: Flow not working 100% with HOCs */
            // $FlowFixMe[prop-missing] automated comment
            <Input
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onEnterKey={this.handleEnterKey}
                value={value}
            />
        );
    }
}
