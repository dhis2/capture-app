// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import TextField from '../../FormFields/Generic/D2TextField.component';
import withInternalChangeHandler from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: ?string,
    error: ?string,
    onBlur: ({ min: string }) => void,
    onChange: (value: string) => void,
    onEnterKey: () => void,
    errorClass: string,
};

class MinNumericFilter extends Component<Props> {
    static getValueObject(value: string) {
        return { min: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(MinNumericFilter.getValueObject(value));
    }

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey();
        }
    }

    render() {
        const { value, error, onChange, errorClass } = this.props;
        return (
            <div>
                <TextField
                    onChange={onChange}
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    value={value || ''}
                    placeholder={i18n.t('Min')}
                    fullWidth
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export default withInternalChangeHandler()(MinNumericFilter);
