// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import TextField from '../../FormFields/Generic/D2TextField.component';
import type { UpdatableFilterContent } from '../filters.types';

type Props = {
    onCommitValue: (value: string) => void,
    onUpdate: () => void,
    value: ?string,
};

// $FlowSuppress
class TextFilter extends Component<Props> implements UpdatableFilterContent {
    onGetUpdateData() {
        const value = this.props.value;

        if (!value) {
            return null;
        }

        return {
            requestData: `ilike:${value}`,
            appliedText: value,
        };
    }

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter') {
            this.props.onUpdate();
        }
    }

    render() {
        const { onCommitValue, onUpdate, value } = this.props; //eslint-disable-line
        return (
            <TextField
                onChange={onCommitValue}
                onKeyPress={this.handleKeyPress}
                value={value || ''}
                fullWidth
                placeholder={i18n.t('Contains text')}
            />
        );
    }
}

export default TextFilter;
