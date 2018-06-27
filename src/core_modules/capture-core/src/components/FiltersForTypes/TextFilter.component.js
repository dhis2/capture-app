// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import TextField from '../FormFields/Generic/D2TextField.component';
import type { Convertable } from './filters.types';

type Props = {
    onEdit: (value: string) => void,
    onUpdate: () => void,
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

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter') {
            this.props.onUpdate();
        }
    }

    render() {
        const { onEdit, onUpdate, value } = this.props; //eslint-disable-line
        return (
            <TextField
                onChange={onEdit}
                onKeyPress={this.handleKeyPress}
                value={value}
                fullWidth
                placeholder={i18n.t('Contains text')}
            />
        );
    }
}

export default TextFilter;
