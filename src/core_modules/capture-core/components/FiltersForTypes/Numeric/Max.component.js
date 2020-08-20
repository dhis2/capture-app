// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import TextField from '../../FormFields/Generic/D2TextField.component';
import withInternalChangeHandler from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: ?string,
    error: ?string,
    onBlur: ({ max: string }) => void,
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
        const { error, onBlur, onEnterKey, textFieldRef, errorClass, ...passOnProps } = this.props;
        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <TextField
                    ref={textFieldRef}
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('Max')}
                    fullWidth
                    {...passOnProps}
                />
                <div className={errorClass}>
                    {error}
                </div>
            </div>
        );
    }
}

export default withInternalChangeHandler()(MaxNumericFilter);
