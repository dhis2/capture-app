// @flow
import React, { Component } from 'react';
import Input from './Input.component';
import type { UpdatableFilterContent } from '../filters.types';

type Value = ?string;

type Props = {
    onCommitValue: (value: ?string) => void,
    onUpdate: (updatedValue: ?string) => void,
    value: ?string,
};

// $FlowSuppress
class TextFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;

        if (!value) {
            return null;
        }

        return {
            requestData: `ilike:${value}`,
            appliedText: value,
        };
    }

    handleEnterKey = (value: ?string) => {
        this.props.onUpdate(value || null);
    }

    handleBlur = (value: string) => {
        this.props.onCommitValue(value);
    }

    render() {
        return (
            /* $FlowSuppress: Flow not working 100% with HOCs */
            <Input
                onBlur={this.handleBlur}
                onEnterKey={this.handleEnterKey}
            />
        );
    }
}

export default TextFilter;
