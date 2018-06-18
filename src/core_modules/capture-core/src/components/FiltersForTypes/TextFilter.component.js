// @flow
import React, { Component } from 'react';
import TextField from '../FormFields/Generic/D2TextField.component';
import type { Convertable } from './filters.types';

type Props = {
    onEdit: (value: string) => void,
    value: ?string,
};

class TextFilter extends Component<Props> implements Convertable {
    onConvert() {
        const value = this.props.value;

        return {
            requestData: value,
            appliedText: value,
        };
    }

    render() {
        const { onEdit, value } = this.props;
        return (
            <TextField
                onChange={onEdit}
                value={value}
            />
        );
    }
}

export default TextFilter;
