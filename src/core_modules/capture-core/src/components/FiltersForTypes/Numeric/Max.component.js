// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import TextField from '../../FormFields/Generic/D2TextField.component';
import withInternalChangeHandler from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: ?string,
    error: ?string,
    onBlur: ({ max: string }) => void,
    onChange: (value: string) => void,
    onEnterKey: ({ max: string }) => void,
    textFieldRef: (instance: any) => void,
    errorClass: string,
};

class MaxNumericFilter extends Component<Props> {
    static getValueObject(value: string) {
        return { max: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(MaxNumericFilter.getValueObject(value));
    }

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey(MaxNumericFilter.getValueObject(this.props.value || ''));
        }
    }

    render() {
        const { value, error, onChange, textFieldRef, errorClass } = this.props;
        return (
            <div>
                <TextField
                    ref={textFieldRef}
                    onChange={onChange}
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    value={value || ''}
                    placeholder={i18n.t('Max')}
                    fullWidth
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export default withInternalChangeHandler()(MaxNumericFilter);
