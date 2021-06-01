// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { D2TextField } from '../../FormFields/Generic/D2TextField.component';
import { withInternalChangeHandler } from '../../FormFields/withInternalChangeHandler';

type Props = {
    value: ?string,
    error: ?string,
    onBlur: ({ min: string }) => void,
    onEnterKey: () => void,
    errorClass: string,
};

class MinNumericFilterPlain extends Component<Props> {
    static getValueObject(value: string) {
        return { min: value.trim() };
    }

    handleBlur = (value: string) => {
        this.props.onBlur(MinNumericFilterPlain.getValueObject(value));
    }

    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.onEnterKey();
        }
    }

    render() {
        const { error, errorClass, onBlur, onEnterKey, ...passOnProps } = this.props;
        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <D2TextField
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    placeholder={i18n.t('Min')}
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

export const MinNumericFilter = withInternalChangeHandler()(MinNumericFilterPlain);
